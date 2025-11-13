'use client';

import React from 'react';
import type { Product, ProductCreateRequest, NutritionalValue, Weight, Measure } from '@/types/products';
import type { MeasureDetail } from '@/types/measures';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductCreateRequest | Product) => Promise<void>;
  product?: Product | null;
  mode: 'create' | 'edit';
  measures: MeasureDetail[];
  defaultLocale?: string;
}

// Helper to convert MeasureDetail to Measure for a specific locale
const getMeasureForLocale = (measureDetail: MeasureDetail, locale?: string): Measure | null => {
  const translation = measureDetail.translations.find(t => t.locale === locale) ||
                     measureDetail.translations[0];
  if (!translation) return null;
  
  return {
    id: measureDetail.id,
    code: measureDetail.code,
    measureName: translation.measureName,
    measureShortName: translation.measureShortName,
  };
};

const ProductDialog: React.FC<ProductDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  mode,
  measures,
  defaultLocale = 'en',
}) => {
  const [productName, setProductName] = React.useState('');
  const [caloriesValue, setCaloriesValue] = React.useState('');
  const [caloriesMeasureId, setCaloriesMeasureId] = React.useState('');
  const [proteinsValue, setProteinsValue] = React.useState('');
  const [proteinsMeasureId, setProteinsMeasureId] = React.useState('');
  const [fatsValue, setFatsValue] = React.useState('');
  const [fatsMeasureId, setFatsMeasureId] = React.useState('');
  const [carbsValue, setCarbsValue] = React.useState('');
  const [carbsMeasureId, setCarbsMeasureId] = React.useState('');
  const [weightValue, setWeightValue] = React.useState('');
  const [weightMeasureId, setWeightMeasureId] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize form with product data when editing
  React.useEffect(() => {
    if (mode === 'edit' && product) {
      setProductName(product.productName);
      setCaloriesValue(product.productCalories.nutritionalValue.toString());
      setCaloriesMeasureId(product.productCalories.measure.id);
      setProteinsValue(product.productProteins.nutritionalValue.toString());
      setProteinsMeasureId(product.productProteins.measure.id);
      setFatsValue(product.productFats.nutritionalValue.toString());
      setFatsMeasureId(product.productFats.measure.id);
      setCarbsValue(product.productCarbohydrates.nutritionalValue.toString());
      setCarbsMeasureId(product.productCarbohydrates.measure.id);
      setWeightValue(product.weight.weightValue.toString());
      setWeightMeasureId(product.weight.measure.id);
      setCategories(product.categories && product.categories.length > 0 ? product.categories : ['']);
    } else {
      setProductName('');
      setCaloriesValue('');
      setCaloriesMeasureId('');
      setProteinsValue('');
      setProteinsMeasureId('');
      setFatsValue('');
      setFatsMeasureId('');
      setCarbsValue('');
      setCarbsMeasureId('');
      setWeightValue('');
      setWeightMeasureId('');
      setCategories(['']);
    }
  }, [mode, product, isOpen]);

  const handleCategoryChange = (index: number, value: string) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const handleAddCategory = () => {
    setCategories([...categories, '']);
  };

  const handleRemoveCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    } else {
      setCategories(['']);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      alert('Product name is required');
      return;
    }

    // Validate all numeric values
    const numCalories = parseFloat(caloriesValue);
    const numProteins = parseFloat(proteinsValue);
    const numFats = parseFloat(fatsValue);
    const numCarbs = parseFloat(carbsValue);
    const numWeight = parseFloat(weightValue);

    if (isNaN(numCalories) || isNaN(numProteins) || isNaN(numFats) || isNaN(numCarbs) || isNaN(numWeight)) {
      alert('All nutritional values and weight must be valid numbers');
      return;
    }

    // Validate measures are selected
    if (!caloriesMeasureId || !proteinsMeasureId || !fatsMeasureId || !carbsMeasureId || !weightMeasureId) {
      alert('All measures must be selected');
      return;
    }

    // Get measure objects
    const caloriesMeasureDetail = measures.find(m => m.id === caloriesMeasureId);
    const proteinsMeasureDetail = measures.find(m => m.id === proteinsMeasureId);
    const fatsMeasureDetail = measures.find(m => m.id === fatsMeasureId);
    const carbsMeasureDetail = measures.find(m => m.id === carbsMeasureId);
    const weightMeasureDetail = measures.find(m => m.id === weightMeasureId);

    if (!caloriesMeasureDetail || !proteinsMeasureDetail || !fatsMeasureDetail || !carbsMeasureDetail || !weightMeasureDetail) {
      alert('Invalid measure selected');
      return;
    }

    const caloriesMeasure = getMeasureForLocale(caloriesMeasureDetail, defaultLocale);
    const proteinsMeasure = getMeasureForLocale(proteinsMeasureDetail, defaultLocale);
    const fatsMeasure = getMeasureForLocale(fatsMeasureDetail, defaultLocale);
    const carbsMeasure = getMeasureForLocale(carbsMeasureDetail, defaultLocale);
    const weightMeasure = getMeasureForLocale(weightMeasureDetail, defaultLocale);

    if (!caloriesMeasure || !proteinsMeasure || !fatsMeasure || !carbsMeasure || !weightMeasure) {
      alert('Failed to get measure translations');
      return;
    }

    // Build nutritional values
    const productCalories: NutritionalValue = {
      title: 'Calories',
      shortTitle: 'Cal',
      nutritionalValue: numCalories,
      measure: caloriesMeasure,
    };

    const productProteins: NutritionalValue = {
      title: 'Proteins',
      shortTitle: 'Prot',
      nutritionalValue: numProteins,
      measure: proteinsMeasure,
    };

    const productFats: NutritionalValue = {
      title: 'Fats',
      shortTitle: 'Fat',
      nutritionalValue: numFats,
      measure: fatsMeasure,
    };

    const productCarbohydrates: NutritionalValue = {
      title: 'Carbohydrates',
      shortTitle: 'Carb',
      nutritionalValue: numCarbs,
      measure: carbsMeasure,
    };

    const weight: Weight = {
      weightValue: numWeight,
      measure: weightMeasure,
    };

    // Filter out empty categories
    const filteredCategories = categories.filter(cat => cat.trim() !== '');

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        const createData: ProductCreateRequest = {
          productName: productName.trim(),
          productCalories,
          productProteins,
          productFats,
          productCarbohydrates,
          weight,
          categories: filteredCategories.length > 0 ? filteredCategories : undefined,
        };
        await onSave(createData);
      } else if (product) {
        const updateData: Product = {
          ...product,
          productName: productName.trim(),
          productCalories,
          productProteins,
          productFats,
          productCarbohydrates,
          weight,
          categories: filteredCategories.length > 0 ? filteredCategories : undefined,
        };
        await onSave(updateData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Get available measures for dropdowns
  const availableMeasures = measures.map(m => {
    const translation = m.translations.find(t => t.locale === defaultLocale) || m.translations[0];
    return {
      id: m.id,
      code: m.code,
      displayName: translation ? `${m.code} (${translation.measureShortName})` : m.code,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 dark:bg-zinc-900 my-8">
        <h2 className="mb-6 text-xl font-semibold">
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
              required
            />
          </div>

          {/* Nutritional Values */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Nutritional Values *</h3>
            
            {/* Calories */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Calories</label>
                <input
                  type="number"
                  step="0.01"
                  value={caloriesValue}
                  onChange={(e) => setCaloriesValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Measure</label>
                <select
                  value={caloriesMeasureId}
                  onChange={(e) => setCaloriesMeasureId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                >
                  <option value="">Select...</option>
                  {availableMeasures.map(m => (
                    <option key={m.id} value={m.id}>{m.displayName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Proteins */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Proteins</label>
                <input
                  type="number"
                  step="0.01"
                  value={proteinsValue}
                  onChange={(e) => setProteinsValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Measure</label>
                <select
                  value={proteinsMeasureId}
                  onChange={(e) => setProteinsMeasureId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                >
                  <option value="">Select...</option>
                  {availableMeasures.map(m => (
                    <option key={m.id} value={m.id}>{m.displayName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Fats</label>
                <input
                  type="number"
                  step="0.01"
                  value={fatsValue}
                  onChange={(e) => setFatsValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Measure</label>
                <select
                  value={fatsMeasureId}
                  onChange={(e) => setFatsMeasureId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                >
                  <option value="">Select...</option>
                  {availableMeasures.map(m => (
                    <option key={m.id} value={m.id}>{m.displayName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Carbohydrates</label>
                <input
                  type="number"
                  step="0.01"
                  value={carbsValue}
                  onChange={(e) => setCarbsValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Measure</label>
                <select
                  value={carbsMeasureId}
                  onChange={(e) => setCarbsMeasureId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  required
                >
                  <option value="">Select...</option>
                  {availableMeasures.map(m => (
                    <option key={m.id} value={m.id}>{m.displayName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Weight *
              </label>
              <input
                type="number"
                step="0.01"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Measure *
              </label>
              <select
                value={weightMeasureId}
                onChange={(e) => setWeightMeasureId(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                required
              >
                <option value="">Select...</option>
                {availableMeasures.map(m => (
                  <option key={m.id} value={m.id}>{m.displayName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categories
              </label>
              <button
                type="button"
                onClick={handleAddCategory}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
              >
                + Add Category
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                    placeholder="Category name"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(index)}
                      className="rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDialog;

