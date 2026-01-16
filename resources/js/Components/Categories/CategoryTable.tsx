import { Category } from '@/types';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

/**
 * Props para el componente CategoryTable.
 */
interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

/**
 * Componente para mostrar la tabla de categorías.
 * Renderiza cada categoría con sus acciones de editar y eliminar.
 */
export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
    /**
     * Retorna las clases CSS para el badge de estado.
     */
    const getStatusClasses = (isActive: boolean): string => {
        const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
        return isActive 
            ? `${baseClasses} bg-green-100 text-green-800`
            : `${baseClasses} bg-red-100 text-red-800`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Productos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {category.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {category.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {category.slug}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {category.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800">
                                    {category.products_count || 0}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={getStatusClasses(category.is_active)}>
                                    {category.is_active ? 'Activa' : 'Inactiva'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                <SecondaryButton onClick={() => onEdit(category)}>
                                    Editar
                                </SecondaryButton>
                                <DangerButton onClick={() => onDelete(category.id)}>
                                    Eliminar
                                </DangerButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
