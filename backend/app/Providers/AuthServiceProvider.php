<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Job;
use App\Models\Application;
use App\Policies\JobPolicy;
use App\Policies\ApplicationPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Job::class, JobPolicy::class);
        Gate::policy(Application::class, ApplicationPolicy::class);

        // Admin-only gate example
        Gate::define('admin-only', function ($user) {
            return $user->role === 'admin';
        });
    }
}
