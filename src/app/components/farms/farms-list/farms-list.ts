import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FarmService } from '../../../services/farm.service';
import { Farm } from '../../../models/farm.model';
import { TrimInputDirective } from '../../../directives/trim-input.directive';
import { DisableWhileLoadingDirective } from '../../../directives/disable-while-loading.directive';
import { LoadingSpinnerDirective } from '../../../directives/loading-spinner.directive';

@Component({
  selector: 'app-farms-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TrimInputDirective,
    DisableWhileLoadingDirective,
    LoadingSpinnerDirective,
  ],
  templateUrl: './farms-list.html',
  styleUrl: './farms-list.css',
})
export class FarmsList implements OnInit {
  farms: Farm[] = [];
  query = '';
  sortBy = 'name-asc';
  page = 1;
  readonly pageSize = 9;
  totalFarms = 0;
  hasNext = false;
  loading = true;
  error = false;
  errorMessage = '';
  deletingFarmId = '';

  constructor(private readonly farmService: FarmService) {}

  /**
   * Loads the first page of farm records when the view is initialized.
   */
  ngOnInit(): void {
    this.loadFarms();
  }

  /**
   * Loads a farm page from the backend and updates list state.
   */
  loadFarms(page = this.page): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    this.page = page;

    this.farmService.getFarms(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.totalFarms = response.pagination.total;
        this.hasNext = response.pagination.has_next;
        this.farms = this.sortFarms(response.data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load farms:', err);
        this.error = true;
        this.errorMessage =
          err.error?.message ||
          'Could not connect to the server. Please make sure the backend is running on port 5001.';
        this.loading = false;
      },
    });
  }

  /**
   * Executes a server-side farm search using the current query.
   */
  onSearch(): void {
    const searchTerm = this.query.trim();

    if (!searchTerm) {
      this.loadFarms(1);
      return;
    }

    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.farmService.searchFarms(searchTerm).subscribe({
      next: (data) => {
        this.page = 1;
        this.totalFarms = data.length;
        this.hasNext = false;
        this.farms = this.sortFarms(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to search farms:', err);
        this.error = true;
        this.errorMessage =
          err.error?.message || 'Search failed. Please try a different term.';
        this.loading = false;
      },
    });
  }

  /**
   * Clears the current search term and restores paginated browsing.
   */
  clearSearch(): void {
    if (!this.query) {
      return;
    }

    this.query = '';
    this.loadFarms(1);
  }

  /**
   * Re-applies sorting to the currently displayed farm data.
   */
  onSortChange(): void {
    this.farms = this.sortFarms(this.farms);
  }

  /**
   * Moves to the next farm page when available.
   */
  nextPage(): void {
    if (!this.query.trim() && this.hasNext && !this.loading) {
      this.loadFarms(this.page + 1);
    }
  }

  /**
   * Moves to the previous farm page when available.
   */
  previousPage(): void {
    if (!this.query.trim() && this.page > 1 && !this.loading) {
      this.loadFarms(this.page - 1);
    }
  }

  /**
   * Confirms and deletes a farm record, then refreshes the visible list.
   */
  deleteFarm(farm: Farm): void {
    const farmId = farm._id || '';
    const farmName = farm.farm_name || 'this farm';

    if (!farmId) {
      this.error = true;
      this.errorMessage = 'Unable to delete farm because the identifier is missing.';
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${farmName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.deletingFarmId = farmId;
    this.error = false;
    this.errorMessage = '';

    this.farmService.deleteFarm(farmId).subscribe({
      next: () => {
        this.deletingFarmId = '';
        if (this.query.trim()) {
          this.onSearch();
          return;
        }
        this.loadFarms(this.page);
      },
      error: (err) => {
        this.deletingFarmId = '';
        this.error = true;
        this.errorMessage =
          err.error?.message ||
          'Delete failed. You may need admin permissions to remove this farm.';
      },
    });
  }

  /**
   * Applies list sorting rules selected by the user.
   */
  private sortFarms(farms: Farm[]): Farm[] {
    const sorted = [...farms];

    switch (this.sortBy) {
      case 'name-desc':
        return sorted.sort((a, b) =>
          (b.farm_name || '').localeCompare(a.farm_name || '')
        );
      case 'crop-asc':
        return sorted.sort((a, b) =>
          (a.crop_type || '').localeCompare(b.crop_type || '')
        );
      case 'sensors-desc':
        return sorted.sort(
          (a, b) => (b.sensors?.length || 0) - (a.sensors?.length || 0)
        );
      case 'name-asc':
      default:
        return sorted.sort((a, b) =>
          (a.farm_name || '').localeCompare(b.farm_name || '')
        );
    }
  }
}
