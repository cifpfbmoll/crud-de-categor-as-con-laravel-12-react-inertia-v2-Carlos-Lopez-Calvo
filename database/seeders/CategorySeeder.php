<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electrónica',
                'description' => 'Dispositivos electrónicos y gadgets',
                'is_active' => true,
            ],
            [
                'name' => 'Ropa',
                'description' => 'Prendas de vestir y accesorios',
                'is_active' => true,
            ],
            [
                'name' => 'Hogar',
                'description' => 'Artículos para el hogar y decoración',
                'is_active' => true,
            ],
            [
                'name' => 'Deportes',
                'description' => 'Equipamiento deportivo y fitness',
                'is_active' => true,
            ],
            [
                'name' => 'Libros',
                'description' => 'Libros, revistas y material de lectura',
                'is_active' => true,
            ],
            [
                'name' => 'Juguetes',
                'description' => 'Juguetes y juegos para niños',
                'is_active' => true,
            ],
            [
                'name' => 'Alimentación',
                'description' => 'Productos alimenticios y bebidas',
                'is_active' => true,
            ],
            [
                'name' => 'Belleza',
                'description' => 'Productos de belleza y cuidado personal',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
