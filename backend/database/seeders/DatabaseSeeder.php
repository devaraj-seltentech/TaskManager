<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@seltentechnologies.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@seltentechnologies.com',
                'password' => Hash::make('Admin@123'),
                'is_admin' => true,
            ]
        );
    }
}
