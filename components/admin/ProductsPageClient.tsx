'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductsView from './ProductsView';
import ProductDialog from './ProductDialog';
import type { Product, ProductCreateRequest } from '@/types/products';
import type { MeasureDetail } from '@/types/measures';
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from '@/app/(admin)/admin/products/actions';

interface ProductsPageClientProps {
  products: Product[];
  measures: MeasureDetail[];
  defaultLocale?: string;
}

const ProductsPageClient: React.FC<ProductsPageClientProps> = ({
  products,
  measures,
  defaultLocale = 'en',
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setDialogMode('edit');
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.productName}"?`)) {
      return;
    }

    const result = await deleteProductAction(product.productId);

    if (result.success) {
      showToast('Product deleted successfully', 'success');
      router.refresh();
    } else {
      showToast(result.error || 'Failed to delete product', 'error');
    }
  };

  const handleSave = async (data: ProductCreateRequest | Product) => {
    let result;

    if (dialogMode === 'create') {
      result = await createProductAction(data as ProductCreateRequest);
    } else if (selectedProduct) {
      result = await updateProductAction(selectedProduct.productId, data as Product);
    } else {
      return;
    }

    if (result.success) {
      showToast(
        dialogMode === 'create' ? 'Product created successfully' : 'Product updated successfully',
        'success'
      );
      setIsDialogOpen(false);
      router.refresh();
    } else {
      showToast(result.error || 'Failed to save product', 'error');
      throw new Error(result.error);
    }
  };

  return (
    <>
      <ProductsView
        products={products}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
        mode={dialogMode}
        measures={measures}
        defaultLocale={defaultLocale}
      />

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default ProductsPageClient;

