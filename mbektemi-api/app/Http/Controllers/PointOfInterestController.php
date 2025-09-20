<?php

namespace App\Http\Controllers;

use App\Models\PointOfInterest;
use Illuminate\Http\Request;

class PointOfInterestController extends Controller
{
    public function index()
    {
        // Return camelCase fields expected by the frontend
        return PointOfInterest::orderBy('id')->get()->map(function (PointOfInterest $p) {
            return [
                'id' => (string) $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'address' => $p->address,
                'latitude' => $p->latitude,
                'longitude' => $p->longitude,
                'category' => $p->category,
                'isOpen' => (bool) $p->is_open,
                'openingHours' => $p->opening_hours,
                'phone' => $p->phone,
            ];
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:200',
            'description'  => 'nullable|string',
            'address'      => 'nullable|string|max:255',
            'latitude'     => 'nullable|numeric|between:-90,90',
            'longitude'    => 'nullable|numeric|between:-180,180',
            'category'     => 'required|string|in:mosque,accommodation,food,transport,medical,other',
            'isOpen'       => 'boolean',
            'openingHours' => 'nullable|string|max:100',
            'phone'        => 'nullable|string|max:50',
        ]);

        $poi = PointOfInterest::create([
            'name'          => $data['name'],
            'description'   => $data['description'] ?? null,
            'address'       => $data['address'] ?? null,
            'latitude'      => $data['latitude'] ?? null,
            'longitude'     => $data['longitude'] ?? null,
            'category'      => $data['category'],
            'is_open'       => $data['isOpen'] ?? false,
            'opening_hours' => $data['openingHours'] ?? null,
            'phone'         => $data['phone'] ?? null,
        ]);

        return response()->json([
            'id' => (string) $poi->id,
            'name' => $poi->name,
            'description' => $poi->description,
            'address' => $poi->address,
            'latitude' => $poi->latitude,
            'longitude' => $poi->longitude,
            'category' => $poi->category,
            'isOpen' => (bool) $poi->is_open,
            'openingHours' => $poi->opening_hours,
            'phone' => $poi->phone,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $poi = PointOfInterest::findOrFail($id);

        $data = $request->validate([
            'name'         => 'sometimes|required|string|max:200',
            'description'  => 'sometimes|nullable|string',
            'address'      => 'sometimes|nullable|string|max:255',
            'latitude'     => 'sometimes|nullable|numeric|between:-90,90',
            'longitude'    => 'sometimes|nullable|numeric|between:-180,180',
            'category'     => 'sometimes|required|string|in:mosque,accommodation,food,transport,medical,other',
            'isOpen'       => 'sometimes|boolean',
            'openingHours' => 'sometimes|nullable|string|max:100',
            'phone'        => 'sometimes|nullable|string|max:50',
        ]);

        $map = [
            'name' => 'name',
            'description' => 'description',
            'address' => 'address',
            'latitude' => 'latitude',
            'longitude' => 'longitude',
            'category' => 'category',
            'isOpen' => 'is_open',
            'openingHours' => 'opening_hours',
            'phone' => 'phone',
        ];

        $payload = [];
        foreach ($data as $key => $value) {
            $payload[$map[$key] ?? $key] = $value;
        }

        $poi->update($payload);

        return [
            'id' => (string) $poi->id,
            'name' => $poi->name,
            'description' => $poi->description,
            'address' => $poi->address,
            'latitude' => $poi->latitude,
            'longitude' => $poi->longitude,
            'category' => $poi->category,
            'isOpen' => (bool) $poi->is_open,
            'openingHours' => $poi->opening_hours,
            'phone' => $poi->phone,
        ];
    }

    public function destroy(string $id)
    {
        PointOfInterest::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}