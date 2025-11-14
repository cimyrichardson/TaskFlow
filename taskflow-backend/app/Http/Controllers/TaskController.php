<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tasks = Task::where('user_id', $request->user()->id)
                    ->with('category')
                    ->latest()
                    ->get();

        return response()->json($tasks);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'nullable|date',
            'priority' => 'in:low,medium,high'
        ]);

        $task = Task::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'due_date' => $request->due_date,
            'priority' => $request->priority ?? 'medium',
            'status' => 'pending'
        ]);

        return response()->json($task->load('category'), 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task->load('category'));
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:pending,completed'
        ]);

        $task->update($request->all());

        return response()->json($task->load('category'));
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function updateStatus(Request $request, Task $task): JsonResponse
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,completed'
        ]);

        $task->update(['status' => $request->status]);

        return response()->json($task->load('category'));
    }
}