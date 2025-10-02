<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminMetricsController extends Controller
{
    public function __invoke(Request $request)
    {
        // Protected by ['web','auth:sanctum'] at route level
        // Aggregate metrics from existing tables.
        $nowDate = Carbon::now()->toDateString();

        // Pilgrims
        $pilgrimsTotal = (int) DB::table('pilgrims')->count();
        $pilgrimsConfirmed = (int) DB::table('pilgrims')->where('status', 'confirmed')->count();
        $pilgrimsPending = (int) DB::table('pilgrims')->where('status', 'pending')->count();
        $pilgrimsCancelled = (int) DB::table('pilgrims')->where('status', 'cancelled')->count();

        // Schedules (events)
        $eventsTotal = (int) DB::table('schedules')->count();
        // Consider "active" as events whose date is today or in the future if a date column exists
        $activeEvents = (int) DB::table('schedules')
            ->when(DB::getSchemaBuilder()->hasColumn('schedules', 'date'), function ($q) use ($nowDate) {
                $q->whereDate('date', '>=', $nowDate);
            }, function ($q) {
                // If there is no date column, use all events as "active"
                // or you can customize this condition
            })
            ->count();

        // Notifications
        $notificationsTotal = (int) DB::table('notifications')->count();

        // Users and statuses
        $usersTotal = (int) DB::table('users')->count();
        $usersActive = (int) DB::table('users')->where('status', 'active')->count();
        $usersInactive = (int) DB::table('users')->where('status', 'inactive')->count();
        $usersSuspended = (int) DB::table('users')->where('status', 'suspended')->count();

        return response()->json([
            'pilgrims' => [
                'total' => $pilgrimsTotal,
                'confirmed' => $pilgrimsConfirmed,
                'pending' => $pilgrimsPending,
                'cancelled' => $pilgrimsCancelled,
            ],
            'events' => [
                'total' => $eventsTotal,
                'active' => $activeEvents,
            ],
            'notifications' => [
                'total' => $notificationsTotal,
            ],
            'users' => [
                'total' => $usersTotal,
                'active' => $usersActive,
                'inactive' => $usersInactive,
                'suspended' => $usersSuspended,
            ],
            'generatedAt' => Carbon::now()->toISOString(),
        ]);
    }
}