<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PointOfInterest;
use App\Models\Notification;
use App\Models\Schedule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default test user (idempotent)
        User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // Simple admin user for demo (matches frontend rule) - idempotent
        User::query()->updateOrCreate(
            ['email' => 'admin@mbektemi.sn'],
            [
                'name' => 'Admin MbekteMi',
                'password' => Hash::make('password'),
            ]
        );

        // Seed a few POIs (idempotent)
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

        // Seed notifications (idempotent)
        $notifications = [
            [
                'title' => 'Ouverture officielle du Magal',
                'message' => "La cérémonie d'ouverture aura lieu demain à 08:30 au Mausolée de Cheikh Ahmadou Bamba.",
                'type' => 'info',
            ],
            [
                'title' => 'Alerte météo',
                'message' => "Risque d'averses dans l'après-midi. Merci de prévoir des protections appropriées.",
                'type' => 'warning',
            ],
            [
                'title' => 'Annonce importante',
                'message' => "Changement d'horaire pour la prière collective du matin: 05:15 au lieu de 05:30.",
                'type' => 'urgent',
            ],
        ];

        foreach ($notifications as $n) {
            Notification::query()->updateOrCreate(
                ['title' => $n['title']],
                $n
            );
        }

        // Seed schedules with dates (idempotent)
        $schedules = [
            [
                'title' => "Prière collective du matin",
                'description' => "Grande prière collective rassemblant tous les pèlerins",
                'date' => '2025-02-17',
                'start_time' => '05:30',
                'end_time' => '07:00',
                'location' => "Grande Mosquée de Touba",
                'type' => 'prayer',
            ],
            [
                'title' => "Cérémonie d'ouverture officielle",
                'description' => "Ouverture officielle du Magal de Touba avec les autorités religieuses",
                'date' => '2025-02-16',
                'start_time' => '08:30',
                'end_time' => '11:00',
                'location' => "Mausolée de Cheikh Ahmadou Bamba",
                'type' => 'ceremony',
            ],
            [
                'title' => "Récitation du Coran",
                'description' => "Récitation collective du Saint Coran par les érudits",
                'date' => '2025-02-17',
                'start_time' => '09:00',
                'end_time' => '12:00',
                'location' => "Grande Mosquée de Touba",
                'type' => 'event',
            ],
        ];

        foreach ($schedules as $s) {
            Schedule::query()->updateOrCreate(
                ['title' => $s['title']],
                $s
            );
        }
    }
}
