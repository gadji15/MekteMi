<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) ($request->query('per_page', 20));
        $items = Notification::orderByDesc('id')->paginate($perPage);
        return NotificationResource::collection($items);
    }

    public function store(StoreNotificationRequest $request)
    {
        $n = Notification::create($request->validated());
        return (new NotificationResource($n))->response()->setStatusCode(201);
    }

    public function update(UpdateNotificationRequest $request, string $id)
    {
        $n = Notification::findOrFail($id);
        $n->update($request->validated());
        return new NotificationResource($n);
    }

    public function destroy(string $id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}