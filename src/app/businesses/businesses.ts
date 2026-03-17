import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../api';

@Component({
  selector: 'app-businesses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './businesses.html',
  styleUrl: './businesses.css',
})
export class Businesses {
  searchQuery = '';
  results: any[] = [];
  searched = false;
  loading = false;
  errorMessage = '';

  constructor(private api: ApiService) {}

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Please enter a search term.';
      return;
    }

    this.loading = true;
    this.searched = false;
    this.errorMessage = '';
    this.results = [];

    this.api.searchFarms(this.searchQuery).subscribe({
      next: (data: any) => {
        this.results = data.data || [];
        this.searched = true;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Search failed. Please try again.';
        this.loading = false;
        this.searched = true;
      },
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.results = [];
    this.searched = false;
    this.errorMessage = '';
  }
}
