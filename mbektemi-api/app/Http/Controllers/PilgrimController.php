<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pilgrim;
use Illuminate\Http\Request;

class PilgrimController extends Controller
{
    public function index()
    {
        // Return camelCase payload for the frontend
        return Pilgrim::orderByDesc('id')
            ->get()
            ->map(function (Pilgrim $p) {
                return [
                    'id' => (string) $p->id,
                    'firstName' => $p->first_name,
                    'lastName' => $p->last_name,
                    'email' => $p->email,
                    'phone' => $p->phone,
                    'city' => $p->city,
                    'country' => $p->country,
                    'accommodationType' => $p->accommodation_type,
                    'specialNeeds' => $p->special_needs,
                    'status' => $p->status,
                    'registrationDate' => $p->registration_date?->toISOString(),
                ];
            });
    }

    public function store(Request $request)
    {
        // Accept camelCase keys from the Next.js app and map to snake_case DB columns
        $data = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName'  => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:pilgrims,email',
            'phone'     => 'required|string|max:50',
            'city'      => 'required|string|max:255',
            'country'   => 'required|string|max:100',
            'accommodationType' => 'nullable|string|max:100',
            'specialNeeds'      => 'nullable|string',
        ]);

        $p = Pilgrim::create([
            'first_name'         => $data['firstName'],
            'last_name'          => $data['lastName'],
            'email'              => $data['email'],
            'phone'              => $data['phone'],
            'city'               => $data['city'],
            'country'            => $data['country'],
            'accommodation_type' => $data['accommodationType'] ?? null,
            'special_needs'      => $data['specialNeeds'] ?? null,
            'status'             => 'pending',
            'registration_date'  => now(),
        ]);

        return response()->json([
            'id' => (string) $p->id,
            'firstName' => $p->first_name,
            'lastName' => $p->last_name,
            'email' => $p->email,
            'phone' => $p->phone,
            'city' => $p->city,
            'country' => $p->country,
            'accommodationType' => $p->accommodation_type,
            'specialNeeds' => $p->special_needs,
            'status' => $p->status,
            'registrationDate' => $p->registration_date?->toISOString(),
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $p = Pilgrim::findOrFail($id);

        $data = $request->validate([
            'firstName' => 'sometimes|required|string|max:255',
            'lastName'  => 'sometimes|required|string|max:255',
            'email'     => 'sometimes|required|email|max:255|unique:pilgrims,email,' . $p->id,
            'phone'     => 'sometimes|required|string|max:50',
            'city'      => 'sometimes|required|string|max:255',
            'country'   => 'sometimes|required|string|max:100',
            'accommodationType' => 'sometimes|nullable|string|max:100',
            'specialNeeds'      => 'sometimes|nullable|string',
            'status'            => 'sometimes|required|in:pending,confirmed,cancelled',
        ]);

        // Map camelCase to snake_case selectively
        $mapped = [];
        foreach ($data as $key => $value) {
            $map = [
                'firstName' => 'first_name',
                'lastName' => 'last_name',
                'email' => 'email',
                'phone' => 'phone',
                'city' => 'city',
                'country' => 'country',
                'accommodationType' => 'accommodation_type',
                'specialNeeds' => 'special_needs',
                'status' => 'status',
            ];
            $mapped[$map[$key] ?? $key] = $value;
        }

        $p->update($mapped);

        return [
            'id' => (string) $p->id,
            'firstName' => $p->first_name,
            'lastName' => $p->last_name,
            'email' => $p->email,
            'phone' => $p->phone,
            'city' => $p->city,
            'country' => $p->country,
            'accommodationType' => $p->accommodation_type,
            'specialNeeds' => $p->special_needs,
            'status' => $p->status,
            'registrationDate' => $p->registration_date?->toISOString(),
        ];
    }

    public function destroy(string $id)
    {
        Pilgrim::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}