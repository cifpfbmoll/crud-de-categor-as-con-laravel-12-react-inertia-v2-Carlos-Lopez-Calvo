import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Category, PageProps, CategoriesPageProps } from '@/types';
import CategoryTable from '@/Components/Categories/CategoryTable';
import CategoryModal from '@/Components/Categories/CategoryModal';
import PrimaryButton from '@/Components/PrimaryButton';

/**
 * Página principal de Categorías.
 * Muestra una tabla con todas las categorías y permite operaciones CRUD.
 * 
 * @param categories - Array de categorías recibidas desde el backend via Inertia
 */
export default function Index({ auth, categories }: PageProps<CategoriesPageProps>) {
    // Estado local para manejar las categorías (permite actualizaciones optimistas)
    const [data, setData] = useState<Category[]>(categories);
    
    // Estados para controlar los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Sincronizar datos cuando cambien los props
    useEffect(() => {
        setData(categories);
    }, [categories]);

    /**
     * Maneja la eliminación de una categoría.
     * Usa router.delete de Inertia para enviar la petición al backend.
     */
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(`/categories/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Actualización optimista: remueve la categoría del estado local
                    setData(prev => prev.filter(c => c.id !== id));
                },
            });
        }
    };

    /**
     * Abre el modal de edición con la categoría seleccionada.
     */
    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    /**
     * Actualiza una categoría en el estado local después de una edición exitosa.
     */
    const handleCategoryUpdate = (updatedCategory: Category) => {
        setData(prev => 
            prev.map(c => c.id === updatedCategory.id ? updatedCategory : c)
        );
    };

    /**
     * Añade una nueva categoría al estado local después de una creación exitosa.
     */
    const handleCategoryCreate = (newCategory: Category) => {
        setData(prev => [newCategory, ...prev]);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gestión de Categorías
                    </h2>
                    <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                        + Nueva Categoría
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Categorías" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Tabla de categorías */}
                            <CategoryTable 
                                categories={data}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            
                            {/* Mensaje cuando no hay categorías */}
                            {data.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No hay categorías registradas. ¡Crea la primera!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para crear categoría */}
            <CategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCategoryCreate}
                mode="create"
            />

            {/* Modal para editar categoría */}
            <CategoryModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSuccess={handleCategoryUpdate}
                mode="edit"
                category={selectedCategory}
            />
        </AuthenticatedLayout>
    );
}
