import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Farm } from '../models/farm.model';

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  constructor(private readonly api: ApiService) {}

  getFarms() {
    return this.api.getFarms();
  }

  getFarmById(id: string) {
    return this.api.getFarmById(id);
  }

  searchFarms(query: string) {
    return this.api.searchFarms(query);
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
}
