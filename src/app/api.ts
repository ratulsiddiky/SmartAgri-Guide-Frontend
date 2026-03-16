import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // This is the URL of your Python Backend!
  private baseUrl = 'http://127.0.0.1:5001/api'; 

  constructor(private http: HttpClient) { }

  // Method to get all farms
  getFarms() {
    return this.http.get(this.baseUrl + '/farms');
  }
}