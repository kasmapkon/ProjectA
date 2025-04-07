export interface Product {
    name: string;
    code: string;
    productCode?: string;
    id?: string;
    price: number;
    salePrice?: number;
    sale: number;
    categoryId: number;
    category?: string;
    imageUrl: string;
    description?: string;
    inStock?: boolean;
    rating?: number;
    reviews?: number;
    tags?: string[];
}
  
export interface Category {
    id: number;
    name: string;
    products: Product[]; // Mảng sản phẩm thuộc về category
}
  