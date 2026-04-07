<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JamoUser extends Model
{
    public $timestamps = false;

    protected $table = 'jamouser';
    protected $primaryKey = 'ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'contact_no',
        'status',
    ];
}
