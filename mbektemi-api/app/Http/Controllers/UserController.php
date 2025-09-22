<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // GET /api/users (protected)
    public function index(Request $request)
    {
        $this->authorizeIfPossible($request);

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'status', 'created_at'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (User $u) {
                [$first, $last] = $this->splitName($u->name);
                return [
                    'id' => (string) $u->id,
                    'firstName' => $first,
                    'lastName' => $last,
                    'email' => $u->email,
                    'role' => $u->role ?? 'pilgrim',
                    'status' => $u->status ?? 'active',
                    'createdAt' => $u->created_at?->toISOString(),
                ];
            });

        return response()->json($users);
    }

    // PATCH /api/users/{id} (protected)
    public function update(Request $request, string $id)
    {
        $this->authorizeIfPossible($request);

        $data = $request->validate([
            'role' => 'nullable|in:admin,volunteer,pilgrim',
            'status' => 'nullable|in:active,inactive,suspended',
            'name' => 'nullable|string|max:255',
        ]);

        $user = User::findOrFail($id);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        if (isset($data['role'])) {
            $user->role = $data['role'];
        }
        if (isset($data['status'])) {
            $user->status = $data['status'];
        }

        $user->save();

        [$first, $last] = $this->splitName($user->name);
        return response()->json([
            'id' => (string) $user->id,
            'firstName' => $first,
            'lastName' => $last,
            'email' => $user->email,
            'role' => $user->role ?? 'pilgrim',
            'status' => $user->status ?? 'active',
            'createdAt' => $user->created_at?->toISOString(),
        ]);
    }

    // DELETE /api/users/{id} (protected)
    public function destroy(Request $request, string $id)
    {
        $this->authorizeIfPossible($request);

        // Prevent self-deletion
        if ($request->user() && (string)$request->user()->id === (string)$id) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte.'], 422);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['success' => true]);
    }

    private function splitName(?string $name): array
    {
        $name = trim((string) $name);
        if ($name === '') {
            return ['', ''];
        }
        $parts = preg_split('/\s+/', $name, 2);
        $first = $parts[0] ?? '';
        $last = $parts[1] ?? '';
        return [$first, $last];
    }

    private function authorizeIfPossible(Request $request): void
    {
        // Optional: plug Gate/Policy here if required.
        // Currently relying on Sanctum protection at route level.
    }
}