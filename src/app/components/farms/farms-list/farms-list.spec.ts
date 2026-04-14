import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { FarmsList } from './farms-list';
import { FarmService } from '../../../services/farm.service';
import { Farm } from '../../../models/farm.model';

describe('FarmsList', () => {
  let component: FarmsList;
  let fixture: ComponentFixture<FarmsList>;
  let farmServiceSpy: {
    getFarms: ReturnType<typeof vi.fn>;
    searchFarms: ReturnType<typeof vi.fn>;
    deleteFarm: ReturnType<typeof vi.fn>;
  };

  const farms: Farm[] = [
    { _id: 'farm-1', farm_name: 'North Field', crop_type: 'Wheat', sensors: [] },
    {
      _id: 'farm-2',
      farm_name: 'Apple Grove',
      crop_type: 'Apple',
      sensors: [{ sensor_id: 's1', type: 'moisture' }],
    },
  ];

  beforeEach(async () => {
    farmServiceSpy = {
      getFarms: vi.fn(() =>
        of({
          data: farms,
          pagination: { page: 1, limit: 9, total: 2, has_next: true },
        }),
      ),
      searchFarms: vi.fn(() => of([farms[1]])),
      deleteFarm: vi.fn(() => of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [FarmsList],
      providers: [
        provideRouter([]),
        { provide: FarmService, useValue: farmServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads first page with pagination state', () => {
    component.loadFarms(2);

    expect(farmServiceSpy.getFarms).toHaveBeenCalledWith(2, 9);
    expect(component.totalFarms).toBe(2);
    expect(component.hasNext).toBe(true);
  });

  it('searches and updates list with results', () => {
    component.query = 'apple';
    component.onSearch();

    expect(farmServiceSpy.searchFarms).toHaveBeenCalledWith('apple');
    expect(component.farms.length).toBe(1);
    expect(component.farms[0].farm_name).toBe('Apple Grove');
  });

  it('applies sorting rules', () => {
    component.farms = [...farms];
    component.sortBy = 'name-desc';
    component.onSortChange();

    expect(component.farms[0].farm_name).toBe('North Field');
    expect(component.farms[1].farm_name).toBe('Apple Grove');
  });

  it('shows search error when search fails', () => {
    farmServiceSpy.searchFarms.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Boom' } }))
    );
    component.query = 'bad';
    component.onSearch();

    expect(component.error).toBe(true);
    expect(component.errorMessage).toContain('Boom');
  });

  it('calls delete when user confirms deletion', () => {
    const originalConfirm = window.confirm;
    const reloadSpy = vi.spyOn(component, 'loadFarms');
    window.confirm = () => true;

    component.deleteFarm({ _id: 'farm-1', farm_name: 'North Field' });

    expect(farmServiceSpy.deleteFarm).toHaveBeenCalledWith('farm-1');
    expect(reloadSpy).toHaveBeenCalled();
    window.confirm = originalConfirm;
  });

  it('does not delete when user cancels confirmation', () => {
    const originalConfirm = window.confirm;
    window.confirm = () => false;

    component.deleteFarm({ _id: 'farm-1', farm_name: 'North Field' });

    expect(farmServiceSpy.deleteFarm).not.toHaveBeenCalled();
    window.confirm = originalConfirm;
  });
});
