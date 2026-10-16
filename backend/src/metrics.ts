import {
  collectDefaultMetrics,
  Counter,
  register,
} from "@prometheus-io/client";

collectDefaultMetrics({ prefix: "nodejs_" });

export { register };

export const catalogSearchesTotal = new Counter({
  name: "climate_store_catalog_searches_total",
  help: "Successful product catalog searches",
});

export const productDetailViewsTotal = new Counter({
  name: "climate_store_product_detail_views_total",
  help: "Successful product detail views",
});

export const productsCreatedTotal = new Counter({
  name: "climate_store_products_created_total",
  help: "Products successfully created",
});

export const productsUpdatedTotal = new Counter({
  name: "climate_store_products_updated_total",
  help: "Products successfully updated",
});

export const productsDeletedTotal = new Counter({
  name: "climate_store_products_deleted_total",
  help: "Products successfully deleted",
});