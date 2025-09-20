<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PointOfInterest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Simple admin user for demo (matches frontend rule)
        User::query()->updateOrCreate(
            ['email' => 'admin@mbektemi.sn'],
            [
                'name' => 'Admin MbekteMi',
                'password' => Hash::make('password'),
            ]
        );

        // Seed a few POIs
        $pois = [
            [
                'name' => 'Grande Mosquée de Touba',
                'description' => "La mosquée principale où se déroulent les principales cérémonies du Magal",
                'address' => 'Centre-ville, Touba',
                'latitude' => 14.8520000,
                'longitude' => -15.8790000,
                'category' => 'mosque',
                'is_open' => true,
                'opening_hours' => 'Ouvert 24h/24',
                'phone' => null,
            ],
            [
                'name' => 'Mausolée de Cheikh Ahmadou Bamba',
                'description' => "Lieu de recueillement et de prière, site le plus sacré de Touba",
                'address' => 'Complexe de la Grande Mosquée, Touba',
                'latitude' => 14.8525000,
                'longitude' => -15.8785000,
                'category' => 'mosque',
                'is_open' => true,
                'opening_hours' => '05:00 - 22:00',
                'phone' => null,
            ],
            [
                'name' => "Restaurant Touba Café",
                'description' => "Cuisine locale et internationale, spécialités sénégalaises",
                'address' => 'Marché central, Touba',
                'latitude' => 14.8502000,
                'longitude' => -15.8801000,
                'category' => 'food',
                'is_open' => true,
                'opening_hours' => '06:00 - 23:00',
                'phone' => '+221 77 XXX XX XX',
            ],
        ];

        foreach ($pois as $poi) {
            PointOfInterest::query()->updateOrCreate(
                ['name' => $poi['name']],
                $poi
            );
        }
    }
}
