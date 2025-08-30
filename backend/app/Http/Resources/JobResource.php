<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'company' => $this->company,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'employer_id' => $this->employer_id,
            'tags' => $this->tags ?? [],
            'is_remote' => (bool) $this->is_remote,
            'job_type' => $this->job_type,
            'location' => $this->location,
            'salary' => $this->salary,
            'requirements' => $this->requirements ?? [],
            'benefits' => $this->benefits ?? [],
            'posted_at' => $this->posted_at ? $this->posted_at : null,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
