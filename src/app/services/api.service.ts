import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Farm } from '../models/farm.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getFarms() {
    return this.http.get<Farm[]>(`${this.baseUrl}/farms`);
  }

  getFarmById(id: string) {
    return this.http.get<Farm>(`${this.baseUrl}/farms/${id}`);
  }

  searchFarms(query: string) {
    return this.http.get<{ data: Farm[] }>(
      `${this.baseUrl}/farms/search?q=${encodeURIComponent(query)}`
    );
  }

  createFarm(data: Partial<Farm>) {
    return this.http.post<Farm>(`${this.baseUrl}/farms`, data);
  }

  updateFarm(id: string, data: Partial<Farm>) {
    return this.http.put<Farm>(`${this.baseUrl}/farms/${id}`, data);
  }

  deleteFarm(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/farms/${id}`);
  }

  getFarmInsights(id: string) {
    return this.http.get<{ dashboard_data: unknown }>(
      `${this.baseUrl}/farms/${id}/insights`
    );
  }

  checkIrrigation(id: string) {
    return this.http.get<unknown>(`${this.baseUrl}/farms/${id}/irrigation_check`);
  }

  syncWeather(id: string) {
    return this.http.post<void>(`${this.baseUrl}/farms/${id}/sync_weather`, {});
  }

  addSensor(id: string, sensor: { sensor_id: string; type: string }) {
    return this.http.post<void>(`${this.baseUrl}/farms/${id}/sensors`, sensor);
  }
}
