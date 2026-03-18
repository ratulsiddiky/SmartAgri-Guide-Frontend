import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  constructor(private api: ApiService) {}

  getFarms() {
    return this.api.getFarms();
  }

  getFarmById(id: string) {
    return this.api.getFarmById(id);
  }

  searchFarms(query: string) {
    return this.api.searchFarms(query);
  }
}

