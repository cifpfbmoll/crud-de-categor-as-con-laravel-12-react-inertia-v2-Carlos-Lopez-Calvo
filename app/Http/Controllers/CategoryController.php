<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Muestra el listado de categorías.
     */
    public function index(): Response
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::withCount('products')->orderBy('name')->get(),
        ]);
    }

    /**
     * Almacena una nueva categoría en la base de datos.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => '¡Categoría creada exitosamente!',
            'category' => $category,
        ], 201);
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = Category::findOrFail($id);
        $category->update($validated);

        return response()->json([
            'message' => '¡Categoría actualizada exitosamente!',
            'category' => $category,
        ], 200);
    }

    /**
     * Elimina una categoría de la base de datos.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $category = Category::findOrFail($id);
        
        // Verificar si tiene productos asociados
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar la categoría porque tiene productos asociados.');
        }

        $category->delete();

        return redirect()->back()->with('success', '¡Categoría eliminada exitosamente!');
    }

    /**
     * Obtiene todas las categorías activas (para select/dropdown).
     */
    public function active(): JsonResponse
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json($categories);
    }
}
