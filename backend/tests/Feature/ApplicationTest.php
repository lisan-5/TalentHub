<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_apply_and_resume_access_and_status_update()
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $applicant = User::factory()->create(['role' => 'applicant']);

        $job = Job::factory()->create(['employer_id' => $employer->id]);

    Storage::fake('public');
    $resume = UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf');

        $token = $applicant->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->post('/api/jobs/'.$job->id.'/apply', [
                'applicant_id' => $applicant->id,
                'applicant_name' => $applicant->name,
                'applicant_email' => $applicant->email,
                'cover_letter' => str_repeat('cover ', 20),
                'resume' => $resume,
            ]);

        $response->assertStatus(201);

        $applicationId = $response->json('application.id');

        // Employer updates status
        $employerToken = $employer->createToken('t')->plainTextToken;
        $status = $this->withHeader('Authorization', 'Bearer '.$employerToken)
            ->patchJson('/api/applications/'.$applicationId.'/status', ['status' => 'shortlisted']);

        $status->assertStatus(200)->assertJsonFragment(['status' => 'shortlisted']);
    }
}
