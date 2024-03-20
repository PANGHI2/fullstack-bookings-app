<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BookingController extends Controller
{
    public function getOne(Request $request, $bookingId): JsonResponse
    {
        $booking = auth()->user()->bookings()->findOrFail($bookingId);

        return response()->json($booking);
    }

    public function getMany(Request $request): JsonResponse
    {
        $bookings = auth()->user()->bookings()->get();

        return response()->json($bookings);
    }

    public function createOne(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'roomNumber' => 'required|string|max:255',
            'checkIn' => 'required|date',
            'checkOut' => 'required|date',
        ]);

        $booking = new Booking($validated);
        $booking->user_id = auth()->id();
        $booking->save();

        return response()->json($booking, Response::HTTP_CREATED);
    }

    public function updateOne(Request $request, $bookingId): JsonResponse
    {
        $validated = $request->validate([
            'fullname' => 'sometimes|required|string|max:255',
            'roomNumber' => 'sometimes|required|string|max:255',
            'checkIn' => 'sometimes|required|date',
            'checkOut' => 'sometimes|required|date',
        ]);

        $booking = auth()->user()->bookings()->findOrFail($bookingId);
        $booking->update($validated);

        return response()->json($booking);
    }

    public function deleteOne(Request $request, $bookingId): JsonResponse
    {
        $booking = auth()->user()->bookings()->findOrFail($bookingId);
        $booking->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
