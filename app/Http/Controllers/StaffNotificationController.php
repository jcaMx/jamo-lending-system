<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()
            ->unreadNotifications()
            ->where('data->kind', 'loan_application_submitted');

        $notifications = (clone $query)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'created_at' => $notification->created_at?->toISOString(),
                'read_at' => $notification->read_at?->toISOString(),
            ]);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => (clone $query)->count(),
        ]);
    }

    public function read(Request $request, string $notification): JsonResponse
    {
        $record = $request->user()
            ->unreadNotifications()
            ->where('data->kind', 'loan_application_submitted')
            ->whereKey($notification)
            ->firstOrFail();

        $record->markAsRead();

        return response()->json(['ok' => true]);
    }
}
