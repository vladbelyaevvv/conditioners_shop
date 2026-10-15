import { z } from "zod";

const productImage = z.union([
  z.url("Некорректная ссылка"),
  z.string().regex(/^\/images\/products\/[a-z0-9._-]+$/i, "Некорректный локальный путь"),
  z.literal(""),
]);

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа").max(200, "Максимум 200 символов"),
  model: z.string().trim().min(1, "Укажите модель").max(100, "Максимум 100 символов"),
  description: z.string().trim().min(10, "Минимум 10 символов").max(5000, "Максимум 5000 символов"),
  price: z.coerce.number<number>().positive("Цена должна быть больше нуля").max(100_000_000, "Цена не должна превышать 100 000 000 ₽"),
  coolingCapacityKw: z.coerce.number<number>().positive("Мощность должна быть больше нуля").max(100, "Мощность не должна превышать 100 кВт"),
  recommendedArea: z.coerce.number<number>().int("Площадь должна быть целым числом").positive("Площадь должна быть больше нуля").max(10_000, "Площадь не должна превышать 10 000 м²"),
  energyClass: z.string().trim().min(1, "Укажите класс").max(10, "Максимум 10 символов"),
  stockQuantity: z.coerce.number<number>().int("Остаток должен быть целым числом").nonnegative("Остаток не может быть отрицательным").max(1_000_000, "Остаток не должен превышать 1 000 000"),
  imageUrl: productImage,
  brandId: z.coerce.number<number>().int().positive("Выберите производителя"),
  categoryId: z.coerce.number<number>().int().positive("Выберите категорию"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
