<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

enum UserAccountStatus: string
{
    case Active = 'Active';
    case InActive = 'InActive';
}

class UserAccount extends Model
{
    protected $table = 'useraccount';

    protected $primaryKey = 'ID';

    protected $timestamps = true;

    protected $fillable = [

        'username',
        'password_hash',
        'status',
        'created_at',
        'updated_at',

    ];

    protected $casts = [

        'status' => UserAccountStatus::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function jamoUser()
    {
        return $this->hasOne(JamoUser::class, 'account_id', 'ID');
    }
}
