'use client';

import React from 'react';
import type { MeasureDetail, MeasureTranslation } from '@/types/measures';

interface MeasureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { code: string; translations: MeasureTranslation[] }) => Promise<void>;
  measure?: MeasureDetail | null;
  mode: 'create' | 'edit';
}

const MeasureDialog: React.FC<MeasureDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  measure,
  mode,
}) => {
  const [code, setCode] = React.useState('');
  const [translations, setTranslations] = React.useState<MeasureTranslation[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize form with measure data when editing
  React.useEffect(() => {
    if (mode === 'edit' && measure) {
      setCode(measure.code);
      setTranslations([...measure.translations]);
    } else {
      setCode('');
      setTranslations([]);
    }
  }, [mode, measure, isOpen]);

  const handleAddTranslation = () => {
    setTranslations([
      ...translations,
      { locale: '', measureName: '', measureShortName: '' },
    ]);
  };

  const handleRemoveTranslation = (index: number) => {
    setTranslations(translations.filter((_, i) => i !== index));
  };

  const handleTranslationChange = (
    index: number,
    field: keyof MeasureTranslation,
    value: string
  ) => {
    const updated = [...translations];
    updated[index] = { ...updated[index], [field]: value };
    setTranslations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      alert('Code is required');
      return;
    }

    if (translations.length === 0) {
      alert('At least one translation is required');
      return;
    }

    // Validate all translations are complete
    const hasIncompleteTranslations = translations.some(
      (t) => !t.locale.trim() || !t.measureName.trim() || !t.measureShortName.trim()
    );

    if (hasIncompleteTranslations) {
      alert('All translation fields must be filled');
      return;
    }

    // Check for duplicate locales
    const locales = translations.map((t) => t.locale);
    const hasDuplicates = locales.length !== new Set(locales).size;

    if (hasDuplicates) {
      alert('Duplicate locales are not allowed');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ code: code.trim(), translations });
      onClose();
    } catch (error) {
      console.error('Failed to save measure:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-zinc-900">
        <h2 className="mb-6 text-xl font-semibold">
          {mode === 'create' ? 'Create Measure' : 'Edit Measure'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., GRAM, KILOGRAM"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
              disabled={mode === 'edit'}
              required
            />
          </div>

          {/* Translations */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Translations
              </label>
              <button
                type="button"
                onClick={handleAddTranslation}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
              >
                + Add Translation
              </button>
            </div>

            <div className="space-y-3">
              {translations.map((translation, index) => (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Translation {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTranslation(index)}
                      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={translation.locale}
                      onChange={(e) =>
                        handleTranslationChange(index, 'locale', e.target.value)
                      }
                      placeholder="Locale (e.g., en)"
                      className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                      required
                    />
                    <input
                      type="text"
                      value={translation.measureName}
                      onChange={(e) =>
                        handleTranslationChange(index, 'measureName', e.target.value)
                      }
                      placeholder="Name (e.g., Gram)"
                      className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                      required
                    />
                    <input
                      type="text"
                      value={translation.measureShortName}
                      onChange={(e) =>
                        handleTranslationChange(
                          index,
                          'measureShortName',
                          e.target.value
                        )
                      }
                      placeholder="Short (e.g., g)"
                      className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>
              ))}

              {translations.length === 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No translations yet. Click "Add Translation" to get started.
                </p>
              )}
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

export default MeasureDialog;
