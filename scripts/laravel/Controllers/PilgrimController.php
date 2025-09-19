<?php

namespace App\Http\Controllers;

use App\Models\Pilgrim;
use Illuminate\Http\Request;

class PilgrimController extends Controller
{
    public function index()
    {
        return Pilgrim::orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'firstName'         => 'required|string|max:100',
            'lastName'          => 'required|string|max:100',
            'email'             => 'required|email',
            'phone'             => 'required|string|max:30',
            'city'              => 'required|string|max:100',
            'country'           => 'required|string|max:100',
            'accommodationType' => 'nullable|string|max:100',
            'specialNeeds'      => 'nullable|string',
        ]);

        $pilgrim = Pilgrim::create($data + ['status' => 'pending']);

        return response()->json($pilgrim, 201);
    }

    public function update(Request $request, string $id)
    {
        $pilgrim = Pilgrim::findOrFail($id);
        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);
        $pilgrim->update($data);
        return $pilgrim;
    }

    public function destroy(string $id)
    {
        Pilgrim::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}