<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected function resolveRole(User $user): string
    {
        // Admin list can be configured via env ADMIN_EMAILS (comma-separated), defaults to admin@mbektemi.sn
        $configured = env('ADMIN_EMAILS', 'admin@mbektemi.sn');
        $admins = array_filter(array_map(
            fn ($e) => strtolower(trim($e)),
            explode(',', (string) $configured)
        ));

        return in_array(strtolower($user->email), $admins, true) ? 'admin' : 'pilgrim';
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'firstName' => 'required|string|max:100',
            'lastName'  => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $data['firstName'].' '.$data['lastName'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Log the user in (session-based)
        Auth::login($user);
        $request->session()->regenerate();

        [$first, $last] = explode(' ', $user->name.' ', 2);

        return response()->json([
            'id'        => (string) $user->id,
            'email'     => $user->email,
            'firstName' => trim($first) ?: 'User',
            'lastName'  => trim($last) ?: '',
            'role'      => $this->resolveRole($user),
            'createdAt' => $user->created_at?->toISOString(),
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($credentials, true)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $request->session()->regenerate();

        /** @var \App\Models\User $user */
        $user = Auth::user();
        [$first, $last] = explode(' ', $user->name.' ', 2);

        return response()->json([
            'id'        => (string) $user->id,
            'email'     => $user->email,
            'firstName' => trim($first) ?: 'User',
            'lastName'  => trim($last) ?: '',
            'role'      => $this->resolveRole($user),
            'createdAt' => $user->created_at?->toISOString(),
        ]);
    }

    public function me(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        [$first, $last] = explode(' ', $user->name.' ', 2);

        return response()->json([
            'id'        => (string) $user->id,
            'email'     => $user->email,
            'firstName' => trim($first) ?: 'User',
            'lastName'  => trim($last) ?: '',
            'role'      => $this->resolveRole($user),
            'createdAt' => $user->created_at?->toISOString(),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }
}