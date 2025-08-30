<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    /**
     * Submit an application for a job posting.
     */
    public function store(Request $request, $jobId)
    {
    $job = Job::findOrFail($jobId);

        $rules = [
            'applicant_id' => ['required','exists:users,id'],
            'applicant_name' => ['required','string','max:255'],
            'applicant_email' => ['required','email','max:255'],
            'cover_letter' => ['required','string','min:50'],
            'resume' => ['required','file','mimes:pdf,doc,docx','max:5120'], // max 5MB
        ];

    $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

    // sanitize inputs
    $applicantName = trim(strip_tags($request->input('applicant_name')));
    $coverLetter = trim(strip_tags($request->input('cover_letter')));

    // Prevent duplicate applications via unique constraint check
        $exists = Application::where('job_id', $job->id)
            ->where('applicant_id', $request->input('applicant_id'))
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already applied for this job.'], 409);
        }

        $resumePath = null;
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');

            // Optional: virus scan using clamscan if available on the host
            $virusScanPassed = $this->scanFileForViruses($file->getPathname());
            if (! $virusScanPassed) {
                return response()->json(['message' => 'Resume failed virus scan.'], 422);
            }

            // determine disk (local for dev, s3 in prod) - fall back to filesystems.default
            $disk = config('files.resume_disk', config('filesystems.default', env('FILESYSTEM_DISK', 'local')));

            $year = now()->format('Y');
            $ext = $file->getClientOriginalExtension() ?: $file->extension();
            $uuid = (string) Str::uuid();
            $filename = "{$uuid}.{$ext}";
            $dir = "resumes/{$year}/{$job->id}";

            // store file
            $stored = Storage::disk($disk)->putFileAs($dir, $file, $filename);
            if ($stored === false) {
                return response()->json(['message' => 'Failed to store resume.'], 500);
            }

            // Save path in storage disk path format
            $resumePath = ltrim($dir . '/' . $filename, '/');
        }

        $application = Application::create([
            'job_id' => $job->id,
            'applicant_id' => $request->input('applicant_id'),
            'applicant_name' => $applicantName,
            'applicant_email' => filter_var($request->input('applicant_email'), FILTER_SANITIZE_EMAIL),
            'resume_path' => $resumePath,
            'cover_letter' => $coverLetter,
            'status' => 'applied',
            'applied_at' => now(),
        ]);

        return response()->json(['application' => $application], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Application::query()->with('job');

        if ($user->role === 'applicant') {
            $query->where('applicant_id', $user->id);
        } elseif ($user->role === 'employer') {
            // applications for employer's jobs
            $query->whereHas('job', function ($q) use ($user) {
                $q->where('employer_id', $user->id);
            });
        } // admin sees all

        $perPage = (int) $request->query('per_page', 15);
        return \App\Http\Resources\ApplicationResource::collection($query->paginate($perPage));
    }

    public function updateStatus(Request $request, \App\Models\Application $application)
    {
        $this->authorize('update', $application);

        $data = $request->validate([
            'status' => 'required|in:applied,shortlisted,rejected,hired',
        ]);

        $application->status = $data['status'];
        $application->save();

        return new \App\Http\Resources\ApplicationResource($application);
    }

    /**
     * Download or stream the resume file for an application.
     */
    public function downloadResume(Request $request, \App\Models\Application $application)
    {
        // authorize view access via policy
        $this->authorize('view', $application);

        if (! $application->resume_path) {
            return response()->json(['message' => 'No resume available'], 404);
        }

        $disk = config('files.resume_disk', config('filesystems.default', env('FILESYSTEM_DISK', 'local')));

        // If using s3, generate temporary URL
        if (Storage::disk($disk)->exists($application->resume_path)) {
            if (config('filesystems.disks.' . $disk . '.driver') === 's3') {
                $url = Storage::disk($disk)->temporaryUrl($application->resume_path, now()->addMinutes(15));
                return response()->json(['url' => $url]);
            }

            // local disk: return download
            return Storage::disk($disk)->download($application->resume_path);
        }

        return response()->json(['message' => 'File not found'], 404);
    }

    /**
     * Scan file for viruses using clamscan if available. Returns true if OK.
     */
    protected function scanFileForViruses(string $path): bool
    {
        // If clamscan/clamdscan isn't available, skip scan (configurable)
        $scanCommand = config('files.virus_scan_command', null);
        if (! $scanCommand) {
            return true;
        }

        $cmd = escapeshellcmd($scanCommand) . ' ' . escapeshellarg($path) . ' 2>&1';
        $output = null;
        $returnVar = null;
        exec($cmd, $output, $returnVar);

        // Typical exit codes: 0 = OK, 1 = virus found, >1 = error
        return $returnVar === 0;
    }
}
