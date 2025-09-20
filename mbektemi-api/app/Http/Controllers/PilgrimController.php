<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePilgrimRequest;
use App\Http\Requests\UpdatePilgrimRequest;
use App\Http\Resources\PilgrimResource;
use App\Models\Pilgrim;
use Illuminate\Http\Request;

class PilgrimController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) ($request->query('per_page', 20));
        $pilgrims = Pilgrim::orderByDesc('id')->paginate($perPage);
        return PilgrimResource::collection($pilgrims);
    }

    public function store(StorePilgrimRequest $request)
    {
        $p = Pilgrim::create($request->payload());
        return (new PilgrimResource($p))->response()->setStatusCode(201);
    }

    public function update(UpdatePilgrimRequest $request, string $id)
    {
        $p = Pilgrim::findOrFail($id);
        $p->update($request->mapped());
        return new PilgrimResource($p);
    }

    public function destroy(string $id)
    {
        Pilgrim::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}