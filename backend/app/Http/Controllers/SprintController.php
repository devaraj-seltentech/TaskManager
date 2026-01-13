<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;


class SprintController extends Controller
{
    /**
     * List all sprints
     */
    public function index()
    {
        $sprints = Sprint::orderBy('start_date', 'desc')->get();

        return response()->json($sprints);
    }

    /**
     * Create a new sprint
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'required|in:to_be_started,in_progress,completed',
        ]);

        $sprint = Sprint::create([
            'name' => $request->name,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'description' => $request->description,
            'status' => $request->status,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Sprint created successfully',
            'sprint' => $sprint
        ], 201);
    }

    public function history($id)
    {
        $sprint = Sprint::with([
            'tasks.assignee:id,name,email',
            'tasks.qaOwner:id,name,email'
        ])->where('status', 'completed')
        ->findOrFail($id);

        return response()->json([
            'sprint' => [
                'id' => $sprint->id,
                'name' => $sprint->name,
                'start_date' => $sprint->start_date,
                'end_date' => $sprint->end_date,
                'status' => $sprint->status,
            ],
            'tasks' => $sprint->tasks->map(function ($task) {
                return [
                    'id' => $task->id,
                    'task_no' => $task->task_no,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'points' => $task->points,
                    'assignee' => $task->assignee,
                    'qa_owner' => $task->qaOwner,
                ];
            }),
        ]);
    }
}
