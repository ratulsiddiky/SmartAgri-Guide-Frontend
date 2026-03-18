import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ── Helpers ───────────────────────────────────────────────
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // ── Auth ──────────────────────────────────────────────────
  login(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password),
    });
    return this.http.post(this.baseUrl + '/login', {}, { headers });
  }

  logout() {
    return this.http.get(this.baseUrl + '/logout', {
      headers: this.authHeaders(),
    });
  }

  // ── Farms ─────────────────────────────────────────────────
  getFarms() {
    return this.http.get(this.baseUrl + '/farms');
  }

  getFarmById(id: string) {
    return this.http.get(this.baseUrl + '/farms/' + id);
  }

  searchFarms(query: string) {
    return this.http.get(
      this.baseUrl + '/farms/search?q=' + encodeURIComponent(query)
    );
  }

  createFarm(data: any) {
    return this.http.post(this.baseUrl + '/farms', data, {
      headers: this.authHeaders(),
    });
  }

  updateFarm(id: string, data: any) {
    return this.http.put(this.baseUrl + '/farms/' + id, data, {
      headers: this.authHeaders(),
    });
  }

  deleteFarm(id: string) {
    return this.http.delete(this.baseUrl + '/farms/' + id, {
      headers: this.authHeaders(),
    });
  }

  // ── Farm features ─────────────────────────────────────────
  getFarmInsights(id: string) {
    return this.http.get(this.baseUrl + '/farms/' + id + '/insights', {
      headers: this.authHeaders(),
    });
  }

  checkIrrigation(id: string) {
    return this.http.get(
      this.baseUrl + '/farms/' + id + '/irrigation_check',
      { headers: this.authHeaders() }
    );
  }

  syncWeather(id: string) {
    return this.http.post(
      this.baseUrl + '/farms/' + id + '/sync_weather',
      {},
      { headers: this.authHeaders() }
    );
  }

  addSensor(id: string, sensor: any) {
    return this.http.post(
      this.baseUrl + '/farms/' + id + '/sensors',
      sensor,
      { headers: this.authHeaders() }
    );
  }
}
