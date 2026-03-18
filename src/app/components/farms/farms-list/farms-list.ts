import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarmService } from '../../../services/farm.service';
import { Farm } from '../../../models/farm.model';

@Component({
  selector: 'app-farms-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farms-list.html',
  styleUrl: './farms-list.css',
})
export class FarmsList implements OnInit {
  farms: Farm[] = [];
  loading = true;
  error = false;

  constructor(private readonly farmService: FarmService) {}

  ngOnInit() {
    this.farmService.getFarms().subscribe({
      next: (data) => {
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
