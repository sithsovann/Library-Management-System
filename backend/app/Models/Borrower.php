<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Borrower extends Model
{
    protected $fillable = ['name', 'email', 'phone'];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }
}