<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id','applicant_id','applicant_name','applicant_email','resume_path','cover_letter','status','applied_at'
    ];

    protected $casts = [
    'applied_at' => 'datetime',
    ];

    public function job()
    {
    return $this->belongsTo(Job::class, 'job_id');
    }

    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }
}
