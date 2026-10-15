import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError, entitiesApi, productsApi } from "../../api";
import { productFormSchema, type ProductFormValues } from "../../schemas";
import styles from "./ProductFormPage.module.css";

const defaults: ProductFormValues = { name: "", model: "", description: "", price: 0, coolingCapacityKw: 0, recommendedArea: 0, energyClass: "A", stockQuantity: 0, imageUrl: "", brandId: 0, categoryId: 0 };

export function ProductFormPage() {
  const rawId = useParams().id;
  const id = rawId ? Number(rawId) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const brands = useQuery({ queryKey: ["brands"], queryFn: () => entitiesApi.list("brands") });
  const categories = useQuery({ queryKey: ["categories"], queryFn: () => entitiesApi.list("categories") });
  const product = useQuery({ queryKey: ["product", id], queryFn: () => productsApi.get(id!), enabled: id !== null });
  const form = useForm<ProductFormValues>({ resolver: zodResolver(productFormSchema), defaultValues: defaults });

  useEffect(() => {
    if (product.data) form.reset({ ...product.data, imageUrl: product.data.imageUrl ?? "" });
  }, [form, product.data]);

  const save = useMutation({
    mutationFn: (input: ProductFormValues) => id ? productsApi.update(id, input) : productsApi.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (error) => {
      if (!(error instanceof ApiError) || !error.details?.fieldErrors) return;
      Object.entries(error.details.fieldErrors).forEach(([name, messages]) => {
        if (name in defaults && messages?.[0]) {
          form.setError(name as keyof ProductFormValues, { type: "server", message: messages[0] });
        }
      });
    },
  });

  const field = (name: keyof ProductFormValues) => form.formState.errors[name]?.message;

  return (
    <section className={styles.panel}>
      <div className={styles.heading}><div><span className="eyebrow">{id ? "Редактирование" : "Новая позиция"}</span><h2>{id ? product.data?.name ?? "Кондиционер" : "Добавить кондиционер"}</h2></div><Link to="/admin/products">← К списку</Link></div>
      {save.isError && <div className="status error">{save.error instanceof ApiError && save.error.details?.fieldErrors ? "Проверьте выделенные поля" : save.error.message}</div>}
      <form className={styles.form} onSubmit={form.handleSubmit((value) => save.mutate(value))}>
        <label>Название<input {...form.register("name")} /><small>{field("name")}</small></label>
        <label>Модель<input {...form.register("model")} /><small>{field("model")}</small></label>
        <label>Производитель<select {...form.register("brandId")}><option value="0">Выберите</option>{brands.data?.map((x) => <option value={x.id} key={x.id}>{x.name}</option>)}</select><small>{field("brandId")}</small></label>
        <label>Категория<select {...form.register("categoryId")}><option value="0">Выберите</option>{categories.data?.map((x) => <option value={x.id} key={x.id}>{x.name}</option>)}</select><small>{field("categoryId")}</small></label>
        <label>Цена, ₽<input type="number" step="0.01" {...form.register("price")} /><small>{field("price")}</small></label>
        <label>Мощность охлаждения, кВт<input type="number" step="0.01" {...form.register("coolingCapacityKw")} /><small>{field("coolingCapacityKw")}</small></label>
        <label>Рекомендуемая площадь, м²<input type="number" {...form.register("recommendedArea")} /><small>{field("recommendedArea")}</small></label>
        <label>Класс энергоэффективности<input {...form.register("energyClass")} /><small>{field("energyClass")}</small></label>
        <label>Остаток, шт.<input type="number" {...form.register("stockQuantity")} /><small>{field("stockQuantity")}</small></label>
        <label className={styles.wide}>Ссылка на изображение<input {...form.register("imageUrl")} placeholder="https://…" /><small>{field("imageUrl")}</small></label>
        <label className={styles.wide}>Описание<textarea rows={6} {...form.register("description")} /><small>{field("description")}</small></label>
        <div className={styles.actions}><button className="button" disabled={save.isPending}>{save.isPending ? "Сохраняем…" : "Сохранить"}</button><Link className="button buttonSecondary" to="/admin/products">Отмена</Link></div>
      </form>
    </section>
  );
}
