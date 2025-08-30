<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    public function create(User $user): bool
    {
        return $user->role === 'employer' || $user->role === 'admin';
    }
    public function update(User $user, Job $job): bool
    {
        return $user->id === $job->employer_id || $user->role === 'admin';
    }

    public function delete(User $user, Job $job): bool
    {
        return $user->id === $job->employer_id || $user->role === 'admin';
    }
}
