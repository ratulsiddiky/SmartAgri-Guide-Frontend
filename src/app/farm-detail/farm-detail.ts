import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api';

@Component({
  selector: 'app-farm-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './farm-detail.html',
  styleUrl: './farm-detail.css',
})
export class FarmDetail implements OnInit {
  farm: any = null;
  insights: any = null;
  irrigation: any = null;
  loading = true;
  error = false;

  syncLoading = false;
  syncMessage = '';

  showSensorForm = false;
  newSensor = { sensor_id: '', type: '' };
  sensorMessage = '';

  constructor(private route: ActivatedRoute, public api: ApiService) {}

  get farmId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.api.getFarmById(this.farmId).subscribe({
      next: (data: any) => {
        this.farm = data;
        this.loading = false;
        this.loadInsights();
        this.loadIrrigation();
      },
      error: (err) => {
        console.error('Failed to load farm:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }

  loadInsights() {
    this.api.getFarmInsights(this.farmId).subscribe({
      next: (data: any) => (this.insights = data.dashboard_data),
      error: () => {},
    });
  }

  loadIrrigation() {
    this.api.checkIrrigation(this.farmId).subscribe({
      next: (data: any) => (this.irrigation = data),
      error: () => {},
    });
  }

  syncWeather() {
    this.syncLoading = true;
    this.syncMessage = '';
    this.api.syncWeather(this.farmId).subscribe({
      next: () => {
        this.syncMessage = '✅ Weather synced successfully!';
        this.syncLoading = false;
        this.ngOnInit();
      },
      error: (err) => {
        this.syncMessage = '❌ ' + (err.error?.message || 'Sync failed');
        this.syncLoading = false;
      },
    });
  }

  addSensor() {
    if (!this.newSensor.sensor_id || !this.newSensor.type) {
      this.sensorMessage = '⚠️ Please fill in both fields.';
      return;
    }
    this.api.addSensor(this.farmId, this.newSensor).subscribe({
      next: () => {
        this.sensorMessage = '✅ Sensor added!';
        this.showSensorForm = false;
        this.newSensor = { sensor_id: '', type: '' };
        this.ngOnInit();
      },
      error: (err) => {
        this.sensorMessage =
          '❌ ' + (err.error?.message || 'Failed to add sensor');
      },
    });
  }
}
