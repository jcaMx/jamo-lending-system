<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Spouse extends Model {
    protected $table = 'spouse';
    protected $fillable = ['borrower_id','full_name','mobile_number','agency_address','occupation'];
}