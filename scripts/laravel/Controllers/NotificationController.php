<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:200',
            'message' => 'required|string',
            'type'    => 'required|in:info,warning,urgent',
        ]);
        $n = Notification::create($data);
        return response()->json($n, 201);
    }

    public function update(Request $request, string $id)
    {
        $n = Notification::findOrFail($id);
        $data = $request->validate([
            'title'   => 'sometimes|required|string|max:200',
            'message' => 'sometimes|required|string',
            'type'    => 'sometimes|required|in:info,warning,urgent',
        ]);
        $n->update($data);
        return $n;
    }

    public function destroy(string $id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}