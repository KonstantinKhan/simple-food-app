'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MeasuresView from './MeasuresView';
import MeasureDialog from './MeasureDialog';
import type { MeasureDetail } from '@/types/measures';
import {
  createMeasureAction,
  updateMeasureAction,
  deleteMeasureAction,
} from '@/app/(admin)/admin/measures/actions';

interface MeasuresPageClientProps {
  measures: MeasureDetail[];
  availableLocales: string[];
  defaultLocale: string;
}

const MeasuresPageClient: React.FC<MeasuresPageClientProps> = ({
  measures,
  availableLocales,
  defaultLocale,
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [selectedMeasure, setSelectedMeasure] = React.useState<MeasureDetail | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedMeasure(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (measure: MeasureDetail) => {
    setDialogMode('edit');
    setSelectedMeasure(measure);
    setIsDialogOpen(true);
  };

  const handleDelete = async (measure: MeasureDetail) => {
    if (!confirm(`Are you sure you want to delete "${measure.code}"?`)) {
      return;
    }

    const result = await deleteMeasureAction(measure.id);

    if (result.success) {
      showToast('Measure deleted successfully', 'success');
      router.refresh();
    } else {
      showToast(result.error || 'Failed to delete measure', 'error');
    }
  };

  const handleSave = async (data: { code: string; translations: Array<{ locale: string; measureName: string; measureShortName: string }> }) => {
    let result;

    if (dialogMode === 'create') {
      result = await createMeasureAction(data);
    } else if (selectedMeasure) {
      result = await updateMeasureAction(selectedMeasure.id, data);
    } else {
      return;
    }

    if (result.success) {
      showToast(
        dialogMode === 'create' ? 'Measure created successfully' : 'Measure updated successfully',
        'success'
      );
      setIsDialogOpen(false);
      router.refresh();
    } else {
      showToast(result.error || 'Failed to save measure', 'error');
      throw new Error(result.error);
    }
  };

  return (
    <>
      <MeasuresView
        measures={measures}
        availableLocales={availableLocales}
        defaultLocale={defaultLocale}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MeasureDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        measure={selectedMeasure}
        mode={dialogMode}
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

export default MeasuresPageClient;
