<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePilgrimRequest;
use App\Http\Requests\UpdatePilgrimRequest;
use App\Http\Resources\PilgrimResource;
use App\Models\Pilgrim;

class PilgrimController extends Controller
{
    public function index()
    {
        // Paginate for scalability; frontend http() will unwrap .data automatically
        $pilgrims = Pilgrim::orderByDesc('id')->paginate(20);
        return PilgrimResource::collection($pilgrims);
    }

    public function store(StorePilgrimRequest $request)
    {
        $data = $request->validated();

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

        return (new PilgrimResource($p))->response()->setStatusCode(201);
    }

    public function update(UpdatePilgrimRequest $request, string $id)
    {
        $p = Pilgrim::findOrFail($id);
        $data = $request->validated();

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

        $mapped = [];
        foreach ($data as $key => $value) {
            $mapped[$map[$key] ?? $key] = $value;
        }

        $p->update($mapped);

        return new PilgrimResource($p);
    }

    public function destroy(string $id)
    {
        Pilgrim::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}