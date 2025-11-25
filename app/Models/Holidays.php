<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

enum HolidayType: string
{
    case Regular = 'Regular';
    case Special = 'Special';
    case Company = 'Company';
}

class Holidays extends Model
{
    protected $table = 'holidays';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [

        'holiday_name',
        'holiday_date',
        'holiday_type',
        'description',
        'is_Recurring',
        'created_at',
    ];

    protected $casts = [

        'is_Recurring' => 'boolean',
        'holiday_type' => HolidayType::class,
        'holiday_date' => 'date',
        'created_at' => 'datetime',

    ];

    public function amortizationSchedules()
    {
        return $this->hasMany(AmortizationSchedule::class, 'holiday_id', 'ID');
    }
}
