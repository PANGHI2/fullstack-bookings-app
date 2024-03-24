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
        $checkIn = fake()->dateTimeBetween('-4 weeks', '+3 weeks');
        $checkOut = fake()->dateTimeBetween((clone $checkIn)->modify('+1 day'), '+4 weeks');

        return [
            'user_id' => fake()->numberBetween(11, 12),
            'fullname' => fake()->name(),
            'roomNumber' => fake()->bothify('Room ##??'),
            'checkIn' => $checkIn->getTimestamp(),
            'checkOut' => $checkOut->getTimestamp(),
        ];
    }
}
