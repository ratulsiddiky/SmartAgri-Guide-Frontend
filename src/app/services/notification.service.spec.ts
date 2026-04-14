import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('shows success message', () => {
    service.showSuccess('Saved');
    expect(service.notification()?.type).toBe('success');
    expect(service.notification()?.message).toBe('Saved');
  });

  it('shows error message', () => {
    service.showError('Failed');
    expect(service.notification()?.type).toBe('error');
    expect(service.notification()?.message).toBe('Failed');
  });

  it('clears message', () => {
    service.showSuccess('Saved');
    service.clear();
    expect(service.notification()).toBeNull();
  });
});
