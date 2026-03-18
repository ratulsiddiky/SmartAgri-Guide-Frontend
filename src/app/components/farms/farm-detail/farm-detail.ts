import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Farm, FarmSensor } from '../../../models/farm.model';
import { FarmService } from '../../../services/farm.service';

interface FarmInsights {
  average_temp?: number;
  average_wind?: number;
  [key: string]: unknown;
}

interface IrrigationStatus {
  status?: string;
  moisture?: number;
  [key: string]: unknown;
}

@Component({
  selector: 'app-farm-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './farm-detail.html',
  styleUrl: './farm-detail.css',
})
export class FarmDetail implements OnInit {
  farm: Farm | null = null;
  insights: FarmInsights | null = null;
  irrigation: IrrigationStatus | null = null;
  loading = true;
  error = false;

  syncLoading = false;
  syncMessage = '';

  showSensorForm = false;
  newSensor: FarmSensor = { sensor_id: '', type: '' };
  sensorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly farmService: FarmService
  ) {}

  get farmId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.farmService.getFarmById(this.farmId).subscribe({
      next: (data) => {
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
    this.farmService.getFarmInsights(this.farmId).subscribe({
      next: (data) => (this.insights = data.dashboard_data as FarmInsights),
      error: () => {},
    });
  }

  loadIrrigation() {
    this.farmService.checkIrrigation(this.farmId).subscribe({
      next: (data) => (this.irrigation = data as IrrigationStatus),
      error: () => {},
    });
  }

  syncWeather() {
    this.syncLoading = true;
    this.syncMessage = '';

    this.farmService.syncWeather(this.farmId).subscribe({
      next: () => {
        this.syncMessage = 'Weather synced successfully.';
        this.syncLoading = false;
        this.ngOnInit();
      },
      error: (err) => {
        this.syncMessage = err.error?.message || 'Sync failed.';
        this.syncLoading = false;
      },
    });
  }

  addSensor() {
    if (!this.newSensor.sensor_id || !this.newSensor.type) {
      this.sensorMessage = 'Please fill in both fields.';
      return;
    }

    this.farmService.addSensor(this.farmId, this.newSensor).subscribe({
      next: () => {
        this.sensorMessage = 'Sensor added successfully.';
        this.showSensorForm = false;
        this.newSensor = { sensor_id: '', type: '' };
        this.ngOnInit();
      },
      error: (err) => {
        this.sensorMessage = err.error?.message || 'Failed to add sensor.';
      },
    });
  }
}
