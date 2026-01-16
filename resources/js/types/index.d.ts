export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

/**
 * Tipo para representar una Categoría.
 * Refleja la estructura de la tabla 'categories' en la base de datos.
 */
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    products_count?: number;
}

/**
 * Tipo para representar un Producto del CRUD.
 * Refleja la estructura de la tabla 'products' en la base de datos.
 */
export interface Product {
    id: number;
    category_id: number | null;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'discontinued';
    created_at: string;
    updated_at: string;
    category?: Category | null;
}

/**
 * Props para las páginas con productos.
 */
export interface ProductsPageProps extends Record<string, unknown> {
    products: Product[];
    categories: Pick<Category, 'id' | 'name'>[];
}

/**
 * Props para las páginas con categorías.
 */
export interface CategoriesPageProps extends Record<string, unknown> {
    categories: Category[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
