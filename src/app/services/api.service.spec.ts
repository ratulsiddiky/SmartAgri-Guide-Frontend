import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    TestBed.inject(HttpClient);
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('performs GET farms request', () => {
    service.getFarms(1, 9).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/farms?page=1&limit=9`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], pagination: { page: 1, limit: 9, total: 0, has_next: false } });
  });

  it('performs POST farm request', () => {
    service.createFarm({ farm_name: 'Farm A' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/farms`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.farm_name).toBe('Farm A');
    req.flush({ message: 'ok' });
  });

  it('performs PUT farm request', () => {
    service.updateFarm('farm-1', { farm_name: 'Farm B' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/farms/farm-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.farm_name).toBe('Farm B');
    req.flush({ message: 'ok' });
  });

  it('performs DELETE farm request', () => {
    service.deleteFarm('farm-1').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/farms/farm-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
