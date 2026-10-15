export interface Brand {
  id: number;
  name: string;
  slug: string;
  country: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  model: string;
  description: string;
  price: number;
  coolingCapacityKw: number;
  recommendedArea: number;
  energyClass: string;
  stockQuantity: number;
  imageUrl: string | null;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductInput {
  name: string;
  model: string;
  description: string;
  price: number;
  coolingCapacityKw: number;
  recommendedArea: number;
  energyClass: string;
  stockQuantity: number;
  imageUrl?: string | null;
  brandId: number;
  categoryId: number;
}

export interface ProductFilters {
  search?: string;
  brandId?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}
