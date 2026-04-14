import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { FarmService } from './farm.service';
import { ApiService } from './api.service';

describe('FarmService', () => {
  let service: FarmService;
  let apiSpy: {
    getFarms: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiSpy = {
      getFarms: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiSpy }],
    });

    service = TestBed.inject(FarmService);
  });

  it('transforms array responses into list result', () => {
    apiSpy.getFarms.mockReturnValueOnce(of([{ _id: 'f1', farm_name: 'Farm A' }]));

    service.getFarms(2, 9).subscribe((result) => {
      expect(result.data.length).toBe(1);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.has_next).toBe(false);
    });
  });

  it('maps paginated response shape correctly', () => {
    apiSpy.getFarms.mockReturnValueOnce(
      of({
        data: [{ _id: 'f1', farm_name: 'Farm A' }],
        pagination: { page: 3, limit: 9, total: 10, has_next: true },
      })
    );

    service.getFarms(1, 9).subscribe((result) => {
      expect(result.pagination.page).toBe(3);
      expect(result.pagination.total).toBe(10);
      expect(result.pagination.has_next).toBe(true);
    });
  });

  it('propagates API errors', () => {
    apiSpy.getFarms.mockReturnValueOnce(
      throwError(() => ({ status: 500, message: 'Server down' }))
    );

    service.getFarms().subscribe({
      next: () => {
        throw new Error('Expected error path');
      },
      error: (error) => {
        expect(error.message).toBe('Server down');
      },
    });
  });
});
