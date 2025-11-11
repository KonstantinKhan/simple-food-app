/**
 * Measures Service
 * Handles all API operations for measures data from the North API
 */

import apiClient from '../api-client';
import type { MeasureDetail, MeasureTranslation } from '@/types/measures';

// Types for API requests
export interface CreateMeasureRequest {
  code: string;
  translations: MeasureTranslation[];
}

export interface UpdateMeasureRequest {
  code?: string;
  translations?: MeasureTranslation[];
}

export interface GetMeasuresParams {
  locale?: string;
  search?: string;
}

const measuresService = {
  /**
   * Get all measures
   * @param params Optional query parameters for filtering
   * @returns Array of measures
   */
  async getMeasures(params?: GetMeasuresParams): Promise<MeasureDetail[]> {
    let endpoint = '/measures';

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.locale) queryParams.append('locale', params.locale);
      if (params.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return apiClient.get<MeasureDetail[]>(endpoint);
  },

  /**
   * Get a single measure by ID
   * @param id Measure UUID
   * @returns Measure detail
   */
  async getMeasureById(id: string): Promise<MeasureDetail> {
    return apiClient.get<MeasureDetail>(`/measures/${id}`);
  },

  /**
   * Get a single measure by code
   * @param code Measure code (e.g., "GRAM", "KILOGRAM")
   * @returns Measure detail
   */
  async getMeasureByCode(code: string): Promise<MeasureDetail> {
    return apiClient.get<MeasureDetail>(`/measures/by-code/${code}`);
  },

  /**
   * Create a new measure
   * @param data Measure data to create
   * @returns Created measure
   */
  async createMeasure(data: CreateMeasureRequest): Promise<MeasureDetail> {
    return apiClient.post<MeasureDetail>('/measures', data);
  },

  /**
   * Update an existing measure
   * @param id Measure UUID
   * @param data Measure data to update
   * @returns Updated measure
   */
  async updateMeasure(id: string, data: UpdateMeasureRequest): Promise<MeasureDetail> {
    return apiClient.put<MeasureDetail>(`/measures/${id}`, data);
  },

  /**
   * Delete a measure
   * @param id Measure UUID
   * @returns void
   */
  async deleteMeasure(id: string): Promise<void> {
    return apiClient.delete<void>(`/measures/${id}`);
  },
};

export default measuresService;
