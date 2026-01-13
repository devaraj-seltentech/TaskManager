<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_no',
        'title',
        'description',
        'points',
        'priority',
        'status',
        'sprint_id',
        'assignee_id',
        'qa_owner_id',
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function qaOwner()
    {
        return $this->belongsTo(User::class, 'qa_owner_id');
    }
}
