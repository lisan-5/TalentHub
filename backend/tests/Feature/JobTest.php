<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class JobTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_index()
    {
        $response = $this->getJson('/api/jobs');
        $response->assertStatus(200);
    }

    public function test_employer_can_create_and_delete_job()
    {
        $employer = User::factory()->create(['role' => 'employer']);
        $token = $employer->createToken('test')->plainTextToken;

        $payload = [
            'title' => 'Test Dev',
            'company' => 'Acme',
            'description' => 'Job description here',
            'short_description' => 'Short',
            'job_type' => 'full-time',
        ];

        $create = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/jobs', $payload);

        $create->assertStatus(201)->assertJsonFragment(['title' => 'Test Dev']);
    $jobId = $create->json('data.id') ?? $create->json('id');

        $delete = $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/jobs/'.$jobId);
        $delete->assertStatus(200);
    }
}
