<?php
// scripts/list_job_postings.php
// Bootstraps the Laravel app and prints recent job_postings as JSON.

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Job;
$jobs = Job::orderBy('id', 'desc')->limit(50)->get()->map(function($j) {
    $posted = $j->posted_at;
    if ($posted instanceof DateTime || $posted instanceof \Illuminate\Support\Carbon) {
        $posted = $posted->toDateTimeString();
    }
    $created = $j->created_at;
    if ($created instanceof DateTime || $created instanceof \Illuminate\Support\Carbon) {
        $created = $created->toDateTimeString();
    }
    return [
        'id' => $j->id,
        'title' => $j->title,
        'company' => $j->company,
        'status' => $j->status,
        'posted_at' => $posted,
        'created_at' => $created,
        'employer_id' => $j->employer_id,
    ];
});

echo json_encode($jobs, JSON_PRETTY_PRINT) . PHP_EOL;
