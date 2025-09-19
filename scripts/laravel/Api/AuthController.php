<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user'  => [
                'id'        => (string) $user->id,
                'email'     => $user->email,
                'firstName' => $data['firstName'],
                'lastName'  => $data['lastName'],
                'role'      => 'pilgrim',
                'createdAt' => $user->created_at?->toISOString(),
            ],
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;
        [$first, $last] = explode(' ', $user->name.' ', 2);

        return response()->json([
            'user'  => [
                'id'        => (string) $user->id,
                'email'     => $user->email,
                'firstName' => trim($first) ?: 'User',
                'lastName'  => trim($last) ?: '',
                'role'      => 'admin', // ajustez selon votre logique
                'createdAt' => $user->created_at?->toISOString(),
            ],
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        [$first, $last] = explode(' ', $user->name.' ', 2);

        return response()->json([
            'id'        => (string) $user->id,
            'email'     => $user->email,
            'firstName' => trim($first) ?: 'User',
            'lastName'  => trim($last) ?: '',
            'role'      => 'admin', // ou 'pilgrim' / 'volunteer'
            'createdAt' => $user->created_at?->toISOString(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['success' => true]);
    }
}