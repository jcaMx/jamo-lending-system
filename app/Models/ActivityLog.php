<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    public $timestamps = false;
    protected $fillable = ['user_id','activity','metadata','created_at'];
    protected $casts = ['metadata' => 'array'];
}
