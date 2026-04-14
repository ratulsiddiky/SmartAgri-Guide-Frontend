import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Farm } from '../../../models/farm.model';
import { FarmService } from '../../../services/farm.service';
import { TrimInputDirective } from '../../../directives/trim-input.directive';
import { DisableWhileLoadingDirective } from '../../../directives/disable-while-loading.directive';
import { LoadingSpinnerDirective } from '../../../directives/loading-spinner.directive';

@Component({
  selector: 'app-businesses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TrimInputDirective,
    DisableWhileLoadingDirective,
    LoadingSpinnerDirective,
  ],
  templateUrl: './businesses.html',
  styleUrl: './businesses.css',
})
export class Businesses {
  searchQuery = '';
  results: Farm[] = [];
  searched = false;
  loading = false;
  errorMessage = '';

  constructor(private readonly farmService: FarmService) {}

  onSearch() {
    const query = this.searchQuery.trim();
    if (!query) {
      this.errorMessage = 'Please enter a search term.';
      return;
    }

    this.loading = true;
    this.searched = false;
    this.errorMessage = '';
    this.results = [];

    this.farmService.searchFarms(query).subscribe({
      next: (data) => {
        this.results = data;
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
