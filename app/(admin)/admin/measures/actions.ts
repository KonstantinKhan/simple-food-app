'use server';

/**
 * Server Actions for Measures
 * Handles mutations and data revalidation
 */

import { revalidatePath } from 'next/cache';
import measuresService, {
  CreateMeasureRequest,
  UpdateMeasureRequest,
} from '@/lib/services/measures-service';
import { ApiError } from '@/lib/api-client';
import type { MeasureDetail } from '@/types/measures';

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create a new measure
 */
export const createMeasureAction = async (
  data: CreateMeasureRequest
): Promise<ActionResult<MeasureDetail>> => {
  try {
    const measure = await measuresService.createMeasure(data);
    revalidatePath('/admin/measures');
    return {
      success: true,
      data: measure,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to create measure. Please try again.',
    };
  }
};

/**
 * Update an existing measure
 */
export const updateMeasureAction = async (
  id: string,
  data: UpdateMeasureRequest
): Promise<ActionResult<MeasureDetail>> => {
  try {
    const measure = await measuresService.updateMeasure(id, data);
    revalidatePath('/admin/measures');
    return {
      success: true,
      data: measure,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to update measure. Please try again.',
    };
  }
};

/**
 * Delete a measure
 */
export const deleteMeasureAction = async (id: string): Promise<ActionResult> => {
  try {
    await measuresService.deleteMeasure(id);
    revalidatePath('/admin/measures');
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Failed to delete measure. Please try again.',
    };
  }
};
