<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function view(User $user, Application $application): bool
    {
        // applicant themselves, employer who owns the job, or admin
        return $user->id === $application->applicant_id
            || $user->id === $application->job->employer_id
            || $user->role === 'admin';
    }

    public function update(User $user, Application $application): bool
    {
        return $user->id === $application->applicant_id
            || $user->id === $application->job->employer_id
            || $user->role === 'admin';
    }

    public function delete(User $user, Application $application): bool
    {
        return $user->id === $application->applicant_id
            || $user->role === 'admin';
    }
}
