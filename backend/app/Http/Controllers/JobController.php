<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Job;
use App\Http\Resources\JobResource;

class JobController extends Controller
{
    public function index(Request $request)
    {
                // Only show public, open jobs that are published (posted_at <= now or null)
                $query = Job::query()
                        ->where('status', 'open')
                        ->where(function($q) {
                                $q->whereNull('posted_at')
                                    ->orWhere('posted_at', '<=', now());
                        })
                        ->orderByDesc('posted_at')
                        ->orderByDesc('id');

        if ($q = $request->query('q')) {
            $query->where('title', 'like', "%{$q}%")
                  ->orWhere('company', 'like', "%{$q}%");
        }
        if ($jobType = $request->query('job_type')) {
            $query->where('job_type', $jobType);
        }
        if ($location = $request->query('location')) {
            $query->where('location', 'like', "%{$location}%");
        }
        if (! is_null($request->query('is_remote'))) {
            $query->where('is_remote', (bool) $request->query('is_remote'));
        }

        $perPage = (int) $request->query('per_page', 15);
        $jobs = $query->paginate($perPage);

        return JobResource::collection($jobs);
    }

    /**
     * List jobs owned by the authenticated user (employer).
     */
    public function myJobs(Request $request)
    {
        $user = $request->user();
        $query = Job::query()->where('employer_id', $user->id);

        $perPage = (int) $request->query('per_page', 15);
        return JobResource::collection($query->paginate($perPage));
    }

    public function show(Job $job)
    {
        $job->load('employer');
        $counts = ['applications' => $job->applications()->count()];
        $resource = new JobResource($job);
        $data = $resource->toArray(request());
        $data['counts'] = $counts;
        $data['employer'] = [
            'id' => $job->employer?->id,
            'name' => $job->employer?->name,
            'avatar' => $job->employer?->avatar_url,
        ];
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Job::class);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:255',
            'tags' => 'nullable', // accept array or comma-separated string, normalize below
            'is_remote' => 'sometimes|boolean',
            'job_type' => 'sometimes|in:full-time,part-time,contract,internship',
            'location' => 'nullable|string',
            'salary' => 'nullable|string',
            'requirements' => 'nullable|array',
            'benefits' => 'nullable|array',
            'posted_at' => 'nullable|date',
        ]);

        // normalize tags: accept array or comma separated string
        if (isset($data['tags']) && is_string($data['tags'])) {
            $data['tags'] = array_values(array_filter(array_map('trim', explode(',', $data['tags']))));
        }

        $data['employer_id'] = $request->user()->id;
        // Ensure visible to public by default
        if (empty($data['status'])) {
            $data['status'] = 'open';
        }
        if (empty($data['posted_at'])) {
            $data['posted_at'] = now();
        }

        $job = Job::create($data);

        return new JobResource($job);
    }

    public function update(Request $request, Job $job)
    {
        $this->authorize('update', $job);
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'company' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'short_description' => 'nullable|string|max:255',
            'tags' => 'nullable',
            'is_remote' => 'sometimes|boolean',
            'job_type' => 'sometimes|in:full-time,part-time,contract,internship',
            'location' => 'nullable|string',
            'salary' => 'nullable|string',
            'requirements' => 'nullable|array',
            'benefits' => 'nullable|array',
            'posted_at' => 'nullable|date',
        ]);

        if (isset($data['tags']) && is_string($data['tags'])) {
            $data['tags'] = array_values(array_filter(array_map('trim', explode(',', $data['tags']))));
        }

        $job->update($data);
        return new JobResource($job);
    }

    public function destroy(Job $job)
    {
        $this->authorize('delete', $job);
        $job->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
