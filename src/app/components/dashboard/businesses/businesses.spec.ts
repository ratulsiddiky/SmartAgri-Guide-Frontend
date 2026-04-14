import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Businesses } from './businesses';
import { FarmService } from '../../../services/farm.service';

describe('Businesses', () => {
  let component: Businesses;
  let fixture: ComponentFixture<Businesses>;
  let farmServiceSpy: {
    searchFarms: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    farmServiceSpy = {
      searchFarms: vi.fn(() => of([{ _id: 'f1', farm_name: 'Farm A' }])),
    };

    await TestBed.configureTestingModule({
      imports: [Businesses],
      providers: [{ provide: FarmService, useValue: farmServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Businesses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searches farms and populates results', () => {
    component.searchQuery = 'farm';
    component.onSearch();

    expect(farmServiceSpy.searchFarms).toHaveBeenCalledWith('farm');
    expect(component.results.length).toBe(1);
    expect(component.searched).toBe(true);
  });

  it('handles search error state', () => {
    farmServiceSpy.searchFarms.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Search failed' } }))
    );
    component.searchQuery = 'farm';
    component.onSearch();

    expect(component.errorMessage).toBe('Search failed');
    expect(component.searched).toBe(true);
  });

  it('shows validation error for empty search', () => {
    component.searchQuery = '   ';
    component.onSearch();

    expect(component.errorMessage).toContain('Please enter a search term');
    expect(farmServiceSpy.searchFarms).not.toHaveBeenCalled();
  });

  it('supports no results state', () => {
    farmServiceSpy.searchFarms.mockReturnValueOnce(of([]));
    component.searchQuery = 'none';
    component.onSearch();

    expect(component.results).toEqual([]);
    expect(component.searched).toBe(true);
  });
});
