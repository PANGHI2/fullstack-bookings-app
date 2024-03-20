<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fake()->numberBetween(11, 12),
            'fullname' => fake()->name(),
            'roomNumber' => fake()->bothify('Room ##??'),
            'checkIn' => fake()->dateTimeBetween('-1 week', '+1 week'),
            'checkOut' => fake()->dateTimeBetween('+1 week', '+2 weeks'),
        ];
    }
}
