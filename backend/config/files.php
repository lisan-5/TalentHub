<?php

return [
    // Disk used to store resumes and other uploaded files
    'resume_disk' => env('RESUME_DISK', env('FILESYSTEM_DISK', 'local')),

    // Optional external virus scanning command (e.g., 'clamscan --no-summary')
    'virus_scan_command' => env('VIRUS_SCAN_COMMAND', null),
];
