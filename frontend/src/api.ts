import type { Brand, Category, Product, ProductFilters, ProductInput } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: {
      fieldErrors?: Record<string, string[]>;
      formErrors?: string[];
    },
  ) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
      details?: ApiError["details"];
    } | null;
    throw new ApiError(body?.message ?? "Ошибка запроса", response.status, body?.details);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const productsApi = {
  list(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    const suffix = params.size ? `?${params.toString()}` : "";
    return request<Product[]>(`/products${suffix}`);
  },
  get(id: number) {
    return request<Product>(`/products/${id}`);
  },
  create(input: ProductInput) {
    return request<Product>("/products", { method: "POST", body: JSON.stringify(input) });
  },
  update(id: number, input: ProductInput) {
    return request<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  remove(id: number) {
    return request<void>(`/products/${id}`, { method: "DELETE" });
  },
};

export type EntityKind = "brands" | "categories";
export type Entity = Brand | Category;

export const entitiesApi = {
  list(kind: EntityKind): Promise<Entity[]> {
    return request<Entity[]>(`/${kind}`);
  },
  create(kind: EntityKind, input: Record<string, string | null>) {
    return request<Entity>(`/${kind}`, { method: "POST", body: JSON.stringify(input) });
  },
  update(kind: EntityKind, id: number, input: Record<string, string | null>) {
    return request<Entity>(`/${kind}/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },
  remove(kind: EntityKind, id: number) {
    return request<void>(`/${kind}/${id}`, { method: "DELETE" });
  },
};
