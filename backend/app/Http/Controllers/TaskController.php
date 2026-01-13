<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Create a task (Add Task modal)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:to_do,in_progress,in_code_review,in_qa,ready_to_deployment,done',
            'priority' => 'required|in:low,medium,high,very_high',
            'points' => 'required|integer|min:1|max:20',
            'sprint_id' => 'required|exists:sprints,id',
            'assignee_id' => 'nullable|exists:users,id',
            'qa_owner_id' => 'nullable|exists:users,id',
        ]);

        // Generate Task Number (ST-XXX)
        $lastId = Task::max('id') ?? 0;
        $taskNo = 'ST-' . ($lastId + 101);

        $task = Task::create([
            'task_no' => $taskNo,
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'points' => $request->points,
            'sprint_id' => $request->sprint_id,
            'assignee_id' => $request->assignee_id,
            'qa_owner_id' => $request->qa_owner_id,
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task
        ], 201);
    }

    /**
     * Get tasks for a sprint (Board view)
     */
    public function sprintTasks($sprintId)
    {
        $tasks = Task::with(['assignee:id,name', 'qaOwner:id,name'])
            ->where('sprint_id', $sprintId)
            ->get()
            ->groupBy('status');

        return response()->json([
            'to_do' => $tasks->get('to_do', []),
            'in_progress' => $tasks->get('in_progress', []),
            'in_code_review' => $tasks->get('in_code_review', []),
            'in_qa' => $tasks->get('in_qa', []),
            'ready_to_deployment' => $tasks->get('ready_to_deployment', []),
            'done' => $tasks->get('done', []),
        ]);
    }

    /**
     * Update task status (Drag & Drop)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:to_do,in_progress,in_code_review,in_qa,ready_to_deployment,done',
        ]);

        $task = Task::findOrFail($id);
        $task->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Task status updated',
            'task' => $task
        ]);
    }

    /**
     * Update task (Edit Task)
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:low,medium,high,very_high',
            'points' => 'sometimes|integer|min:1|max:20',
            'assignee_id' => 'nullable|exists:users,id',
            'qa_owner_id' => 'nullable|exists:users,id',
        ]);

        $task->update($request->only([
            'title',
            'description',
            'priority',
            'points',
            'assignee_id',
            'qa_owner_id',
        ]));

        return response()->json([
            'message' => 'Task updated',
            'task' => $task
        ]);
    }

    /**
     * Delete task
     */
    public function destroy($id)
    {
        Task::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Task deleted'
        ]);
    }
}
