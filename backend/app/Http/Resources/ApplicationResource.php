<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'job_id' => $this->job_id,
            'applicant_id' => $this->applicant_id,
            'applicant_name' => $this->applicant_name,
            'applicant_email' => $this->applicant_email,
            'resume_path' => $this->resume_path,
            'cover_letter' => $this->cover_letter,
            'status' => $this->status,
            'applied_at' => $this->applied_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
