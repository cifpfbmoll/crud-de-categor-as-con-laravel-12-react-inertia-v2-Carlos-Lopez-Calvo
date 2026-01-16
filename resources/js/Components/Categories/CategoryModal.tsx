import { useState, useEffect, FormEventHandler } from 'react';
import { Category } from '@/types';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

/**
 * Props para el componente CategoryModal.
 */
interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (category: Category) => void;
    mode: 'create' | 'edit';
    category?: Category | null;
}

/**
 * Estado del formulario para crear/editar categorías.
 */
interface FormData {
    name: string;
    description: string;
    is_active: boolean;
}

/**
 * Errores de validación del formulario.
 */
interface FormErrors {
    name?: string;
    description?: string;
    is_active?: string;
}

/**
 * Modal reutilizable para crear y editar categorías.
 * Maneja validación del lado del cliente y peticiones al backend.
 */
export default function CategoryModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    mode, 
    category 
}: CategoryModalProps) {
    // Estado inicial del formulario
    const initialFormData: FormData = {
        name: '',
        description: '',
        is_active: true,
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    // Cargar datos de la categoría cuando se edita
    useEffect(() => {
        if (mode === 'edit' && category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                is_active: category.is_active,
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [mode, category, isOpen]);

    /**
     * Valida el formulario antes de enviar.
     * Retorna true si es válido.
     */
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Maneja el envío del formulario.
     * Realiza la petición al backend según el modo (crear/editar).
     */
    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setProcessing(true);

        try {
            const url = mode === 'create' 
                ? '/categories' 
                : `/categories/${category?.id}`;
            
            const method = mode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>(
                        'meta[name="csrf-token"]'
                    )?.content || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description || null,
                    is_active: formData.is_active,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(data.category);
                onClose();
                setFormData(initialFormData);
            } else {
                // Manejar errores de validación del servidor
                if (data.errors) {
                    setErrors(data.errors);
                }
            }
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
        } finally {
            setProcessing(false);
        }
    };

    /**
     * Actualiza un campo del formulario.
     */
    const handleChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo al modificarlo
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {mode === 'create' ? 'Crear Nueva Categoría' : 'Editar Categoría'}
                </h2>

                {/* Campo: Nombre */}
                <div className="mb-4">
                    <InputLabel htmlFor="name" value="Nombre *" />
                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Nombre de la categoría"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Campo: Descripción */}
                <div className="mb-4">
                    <InputLabel htmlFor="description" value="Descripción" />
                    <textarea
                        id="description"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Descripción de la categoría (opcional)"
                        rows={3}
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                {/* Campo: Estado Activo */}
                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            checked={formData.is_active}
                            onChange={(e) => handleChange('is_active', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Categoría activa
                        </span>
                    </label>
                    <InputError message={errors.is_active} className="mt-2" />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing 
                            ? 'Guardando...' 
                            : (mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios')
                        }
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
