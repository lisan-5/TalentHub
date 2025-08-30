<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_and_login()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'applicant',
        ]);

        $response->assertStatus(201)->assertJsonStructure(['token','user']);

        $login = $this->postJson('/api/auth/login', [
            'email' => 'alice@example.com',
            'password' => 'password',
        ]);

        $login->assertStatus(200)->assertJsonStructure(['token','user']);
    }
}
