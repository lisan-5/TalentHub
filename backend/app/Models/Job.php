<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_postings';

    protected $casts = [
        'tags' => 'array',
        'requirements' => 'array',
        'benefits' => 'array',
        'is_remote' => 'boolean',
        'posted_at' => 'datetime',
    ];

    protected $fillable = [
        'title','company','short_description','description','employer_id','tags','is_remote','job_type','location','salary','requirements','benefits','posted_at','status'
    ];

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
    }

    // Accessor for formatted posted_at
    public function getPostedAtAttribute($value)
    {
        if (! $value) return null;
        return Carbon::parse($value)->toIso8601String();
    }
}
