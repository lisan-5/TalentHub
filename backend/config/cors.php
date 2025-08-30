<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Allow all methods from the frontend during development
    'allowed_methods' => ['*'],

    // Allow the dev frontend origin (configure FRONTEND_URL in .env for prod)
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],

    'allowed_origins_patterns' => [],

    // Allow Authorization header so Bearer tokens can be sent from browser
    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization', 'Accept', 'Origin'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];