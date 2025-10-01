<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return Schedule::query()
            ->orderBy('date')
            ->orderBy('start_time')
            ->orderBy('id')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'nullable|date',
            'start_time'  => 'nullable|date_format:H:i',
            'end_time'    => 'nullable|date_format:H:i',
            'location'    => 'nullable|string|max:255',
            'type'        => 'required|in:prayer,event,ceremony',
        ]);

        $s = Schedule::create($data);

        return response()->json($s, 201);
    }

    public function update(Request $request, string $id)
    {
        $s = Schedule::findOrFail($id);

        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'date'        => 'sometimes|nullable|date',
            'start_time'  => 'sometimes|nullable|date_format:H:i',
            'end_time'    => 'sometimes|nullable|date_format:H:i',
            'location'    => 'sometimes|nullable|string|max:255',
            'type'        => 'sometimes|required|in:prayer,event,ceremony',
        ]);

        $s->update($data);

        return response()->json($s);
    }

    public function destroy(string $id)
    {
        Schedule::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}