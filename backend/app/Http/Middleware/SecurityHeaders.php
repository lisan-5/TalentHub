<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Basic security headers; tune as needed for your app
        $response->headers->set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');
        $response->headers->set('Permissions-Policy', "fullscreen=()");
        // Content-Security-Policy: keep minimal for API; if you serve frontend from same origin, adapt accordingly
        $response->headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';");

        return $response;
    }
}
