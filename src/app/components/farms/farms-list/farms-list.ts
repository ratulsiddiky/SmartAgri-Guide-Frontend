import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-farms-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farms-list.html',
  styleUrl: './farms-list.css',
})
export class FarmsList implements OnInit {
  farms: any[] = [];
  loading = true;
  error = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getFarms().subscribe({
      next: (data: any) => {
        this.farms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load farms:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }
}
