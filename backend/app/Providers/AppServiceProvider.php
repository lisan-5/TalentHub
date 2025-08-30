<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route as RouteFacade;
use Illuminate\Routing\Router;
use App\Http\Middleware\SecurityHeaders;

class AppServiceProvider extends ServiceProvider
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
    // Register route middleware alias for security headers
    $router = $this->app->make(Router::class);
    $router->aliasMiddleware('security.headers', SecurityHeaders::class);
    // Ensure the CORS middleware alias is available so routes that reference
    // 'cors' can be resolved by the container. This prevents runtime errors
    // like "Target class [cors] does not exist." when handling requests.
    $router->aliasMiddleware('cors', \Illuminate\Http\Middleware\HandleCors::class);
        //
    }
}
