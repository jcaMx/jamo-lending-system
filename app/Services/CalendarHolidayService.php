<?php

namespace App\Services;

use App\Models\Holidays;
use App\Repositories\Interfaces\IHolidayService;
use Carbon\Carbon;

class CalendarHolidayService implements IHolidayService
{
    protected $holidays;

    public function __construct()
    {
        // Loan all holiday models once
        $this->holidays = Holidays::whereNotNull('holiday_date')->get();
    }

    // Check if a date is a holiday
    public function isHoliday(Carbon $date): bool
    {
        return $this->holidays->contains(function ($h) use ($date) {
            if ($h->is_Recurring) {
                return $h->holiday_date->format('m-d') === $date->format('m-d');
            }

            return $h->holiday_date->isSameDay($date);
        });
    }

    // Adjust a date forward if it falls on a holiday
    public function adjustDate(Carbon $date): Carbon
    {
        while ($this->isHoliday($date)) {
            $date->addDay();
        }

        return $date;
    }

    // Get the Holiday model for a given date, if it exists
    public function getHoliday(Carbon $date): ?Holidays
    {
        return $this->holidays->first(function ($h) use ($date) {
            if ($h->is_Recurring) {
                return $h->holiday_date->format('m-d') === $date->format('m-d');
            }

            return $h->holiday_date->isSameDay($date);
        }) ?: null;
    }
}
