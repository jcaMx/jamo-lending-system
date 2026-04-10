<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisbursementEvent extends Model
{
    public $timestamps = false;

    protected $table = 'disbursement_events';

    protected $primaryKey = 'ID';

    protected $fillable = [
        'disbursement_id',
        'event_type',
        'old_status',
        'new_status',
        'payload',
        'actor_id',
        'created_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'created_at' => 'datetime',
    ];

    public function disbursement()
    {
        return $this->belongsTo(Disbursement::class, 'disbursement_id', 'ID');
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id', 'id');
    }
}
