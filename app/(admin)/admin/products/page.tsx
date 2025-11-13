import ProductsPageClient from "@/components/admin/ProductsPageClient";
import productsService from "@/lib/services/products-service";
import measuresService from "@/lib/services/measures-service";
import { ApiError } from "@/lib/api-client";
import type { Product } from "@/types/products";
import type { MeasureDetail } from "@/types/measures";

const ProductsPage = async () => {
  let products: Product[] = [];
  let measures: MeasureDetail[] = [];
  let error: string | null = null;

  try {
    [products, measures] = await Promise.all([
      productsService.getProducts(),
      measuresService.getMeasures(),
    ]);
  } catch (err) {
    error = err instanceof ApiError
      ? err.message
      : 'Failed to load products. Please check your North API connection.';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-semibold">Error loading products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        <ProductsPageClient
          products={products}
          measures={measures}
        />
      </main>
    </div>
  );
};

export default ProductsPage;

