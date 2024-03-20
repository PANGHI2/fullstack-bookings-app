<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()->create([
            'name' => 'Ghita Pantis',
            'email' => 'ghitapantis1@gmail.com',
        ]);
        User::factory()->create([
            'name' => 'Alexandra Pantis',
            'email' => 'alepantis@gmail.com',
        ]);

        Booking::factory(50)->create();
    }
}
