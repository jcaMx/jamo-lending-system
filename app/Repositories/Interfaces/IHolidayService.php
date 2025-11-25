<?php

namespace App\Repositories\Interfaces;

use App\Models\Holidays;
use Carbon\Carbon;

interface IHolidayService
{
    public function isHoliday(Carbon $date): bool;

    public function adjustDate(Carbon $date): Carbon;

    public function getHoliday(Carbon $date): ?Holidays;
}
