<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => (string) $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'start_time'  => $this->start_time,
            'end_time'    => $this->end_time,
            'location'    => $this->location,
            'type'        => $this->type,
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
        ];
    }
}