import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { entitiesApi, type EntityKind } from "../../api";
import styles from "./Admin.module.css";

export function EntitiesPage({ kind }: { kind: EntityKind }) {
  const isBrands = kind === "brands";
  const title = isBrands ? "Производители" : "Категории";
  const extraKey = isBrands ? "country" : "description";
  const extraTitle = isBrands ? "Страна" : "Описание";
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const entities = useQuery({ queryKey: [kind], queryFn: () => entitiesApi.list(kind) });
  const save = useMutation({
    mutationFn: () => editingId
      ? entitiesApi.update(kind, editingId, { name, [extraKey]: extra || null })
      : entitiesApi.create(kind, { name, [extraKey]: extra || null }),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: [kind] }); clear(); },
  });
  const remove = useMutation({ mutationFn: (id: number) => entitiesApi.remove(kind, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind] }) });

  function clear() { setName(""); setExtra(""); setEditingId(null); }
  function submit(event: FormEvent) { event.preventDefault(); save.mutate(); }
  function edit(entity: Record<string, unknown>) { setEditingId(entity.id as number); setName(entity.name as string); setExtra((entity[extraKey] as string | null) ?? ""); }
  function removeEntity(id: number, entityName: string) { if (window.confirm(`Удалить «${entityName}»?`)) remove.mutate(id); }

  return (
    <section className={styles.entityGrid}>
      <div className={styles.panel}><div className={styles.panelHeading}><div><h2>{title}</h2><p>{entities.data?.length ?? 0} записей</p></div></div>
        {(save.isError || remove.isError) && <div className="status error">{save.error?.message ?? remove.error?.message}</div>}
        <div className={styles.tableWrap}><table><thead><tr><th>Название</th><th>{extraTitle}</th><th /></tr></thead><tbody>{entities.data?.map((entity) => {
          const record = entity as unknown as Record<string, unknown>;
          return <tr key={entity.id}><td><strong>{entity.name}</strong></td><td>{String(record[extraKey] ?? "—")}</td><td><div className={styles.rowActions}><button className="button buttonSmall buttonSecondary" onClick={() => edit(record)}>Изменить</button><button className="button buttonSmall buttonDanger" onClick={() => removeEntity(entity.id, entity.name)}>Удалить</button></div></td></tr>;
        })}</tbody></table></div>
      </div>
      <form className={styles.sideForm} onSubmit={submit}><h3>{editingId ? "Редактировать" : "Добавить"}</h3><label>Название<input required minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></label><label>{extraTitle}<textarea rows={4} value={extra} onChange={(e) => setExtra(e.target.value)} /></label><div className={styles.rowActions}><button className="button" disabled={save.isPending}>Сохранить</button>{editingId && <button className="button buttonSecondary" type="button" onClick={clear}>Отмена</button>}</div></form>
    </section>
  );
}
