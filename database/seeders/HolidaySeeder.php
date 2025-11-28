<?php

namespace Database\Seeders;

use App\Models\Holidays;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $currentYear = now()->year;
        $nextYear = $currentYear + 1;

        $holidays = [
            // Regular Holidays
            [
                'holiday_name' => 'New Year\'s Day',
                'holiday_date' => "{$currentYear}-01-01",
                'holiday_type' => 'Regular',
                'description' => 'New Year celebration',
                'is_Recurring' => true,
            ],
            [
                'holiday_name' => 'Independence Day',
                'holiday_date' => "{$currentYear}-06-12",
                'holiday_type' => 'Regular',
                'description' => 'Philippine Independence Day',
                'is_Recurring' => true,
            ],
            [
                'holiday_name' => 'National Heroes Day',
                'holiday_date' => "{$currentYear}-08-26",
                'holiday_type' => 'Regular',
                'description' => 'Commemoration of national heroes',
                'is_Recurring' => true,
            ],
            [
                'holiday_name' => 'Bonifacio Day',
                'holiday_date' => "{$currentYear}-11-30",
                'holiday_type' => 'Regular',
                'description' => 'Birth anniversary of Andres Bonifacio',
                'is_Recurring' => true,
            ],
            [
                'holiday_name' => 'Rizal Day',
                'holiday_date' => "{$currentYear}-12-30",
                'holiday_type' => 'Regular',
                'description' => 'Death anniversary of Dr. Jose Rizal',
                'is_Recurring' => true,
            ],
            // Special Holidays
            [
                'holiday_name' => 'Christmas Day',
                'holiday_date' => "{$currentYear}-12-25",
                'holiday_type' => 'Special',
                'description' => 'Christmas celebration',
                'is_Recurring' => true,
            ],
            [
                'holiday_name' => 'New Year\'s Eve',
                'holiday_date' => "{$currentYear}-12-31",
                'holiday_type' => 'Special',
                'description' => 'Year-end celebration',
                'is_Recurring' => true,
            ],
            // Company Holidays
            [
                'holiday_name' => 'Company Foundation Day',
                'holiday_date' => "{$currentYear}-03-15",
                'holiday_type' => 'Company',
                'description' => 'Annual company foundation day celebration',
                'is_Recurring' => true,
            ],
        ];

        foreach ($holidays as $holidayData) {
            Holidays::firstOrCreate(
                [
                    'holiday_name' => $holidayData['holiday_name'],
                    'holiday_date' => $holidayData['holiday_date'],
                ],
                array_merge($holidayData, ['created_at' => now()])
            );
        }
    }
}
