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
        $from = $request->query('from');
        $to = $request->query('to');

        $bookingsQuery = auth()->user()->bookings();
        if ($from && $to) {
            $bookingsQuery->where(function ($q) use ($from, $to) {
                $q->where('checkIn', '<', $from)
                    ->where('checkOut', '>', $to);
            })->orWhereBetween('checkIn', [$from, $to])
                ->orWhereBetween('checkOut', [$from, $to]);
        } elseif ($from) {
            $bookingsQuery->where('checkOut', '>=', $from);
        } elseif ($to) {
            $bookingsQuery->where('checkIn', '<=', $to);
        }

        $bookingsQuery->orderBy('updated_at', 'desc');

        if ($request->has('page')) {
            $bookings = $bookingsQuery->paginate(10);
        } else {
            $bookings = $bookingsQuery->get();
        }

        return response()->json($bookings);
    }

    public function createOne(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'roomNumber' => 'required|string|max:255',
            'checkIn' => 'required|integer',
            'checkOut' => 'required|integer',
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
            'checkIn' => 'sometimes|required|integer',
            'checkOut' => 'sometimes|required|integer',
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
