<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::where('user_id', $request->user()->id)
                            ->withCount('tasks')
                            ->latest()
                            ->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'color' => 'nullable|string|max:7'
        ]);

        $category = Category::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'color' => $request->color ?? '#3B82F6'
        ]);

        return response()->json($category, 201);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Réaffecter les tâches de cette catégorie à null
        $category->tasks()->update(['category_id' => null]);

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}