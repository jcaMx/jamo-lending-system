<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false; // uses created_at only
    protected $fillable = ['user_id','action','entity_type','entity_id','changes','created_at'];
    protected $casts = ['changes' => 'array'];
}
