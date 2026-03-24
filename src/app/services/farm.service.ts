import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  ApiService,
  BroadcastAlertRequest,
  FarmListResponse,
} from './api.service';
import { Farm } from '../models/farm.model';

export interface FarmListResult {
  data: Farm[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_next: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  constructor(private readonly api: ApiService) {}

  getFarms(page = 1, limit = 9) {
    return this.api.getFarms(page, limit).pipe(
      map((response): FarmListResult => {
        if (Array.isArray(response)) {
          return {
            data: response,
            pagination: {
              page,
              limit,
              total: response.length,
              has_next: false,
            },
          };
        }

        const typedResponse = response as FarmListResponse;
        return {
          data: typedResponse.data || [],
          pagination: {
            page: typedResponse.pagination?.page ?? page,
            limit: typedResponse.pagination?.limit ?? limit,
            total: typedResponse.pagination?.total ?? 0,
            has_next: typedResponse.pagination?.has_next ?? false,
          },
        };
      })
    );
  }

  getFarmById(id: string) {
    return this.api.getFarmById(id);
  }

  searchFarms(query: string) {
    return this.api.searchFarms(query).pipe(map((response) => response.data || []));
  }

  createFarm(data: Partial<Farm>) {
    return this.api.createFarm(data);
  }

  updateFarm(id: string, data: Partial<Farm>) {
    return this.api.updateFarm(id, data);
  }

  deleteFarm(id: string) {
    return this.api.deleteFarm(id);
  }

  getFarmInsights(id: string) {
    return this.api.getFarmInsights(id);
  }

  checkIrrigation(id: string) {
    return this.api.checkIrrigation(id);
  }

  syncWeather(id: string) {
    return this.api.syncWeather(id);
  }

  addSensor(id: string, sensor: { sensor_id: string; type: string }) {
    return this.api.addSensor(id, sensor);
  }

  /**
   * Sends an admin broadcast alert for farms inside the provided danger zone.
   */
  broadcastAlert(payload: BroadcastAlertRequest) {
    return this.api.broadcastAlert(payload);
  }

  /**
   * Retrieves region-level community weather insight metrics.
   */
  getRegionalInsights(regionName: string) {
    return this.api.getRegionalInsights(regionName);
  }
}
