import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminDashboard } from './admin-dashboard';
import { FarmService } from '../../../services/farm.service';

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;
  let broadcastCalled = false;

  beforeEach(async () => {
    broadcastCalled = false;

    const farmServiceStub = {
      broadcastAlert: () => {
        broadcastCalled = true;
        return of({ message: 'Alert broadcast!', farms_notified: 2 });
      },
      getRegionalInsights: () =>
        of({
          message: 'Community averages',
          data: { community_avg_temp: 20, total_farms_included: 3 },
        }),
    } as unknown as FarmService;

    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [{ provide: FarmService, useValue: farmServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call broadcastAlert for valid broadcast form payload', () => {
    component.broadcastForm.setValue({
      alert_type: 'Flood',
      danger_zone:
        '{"type":"Polygon","coordinates":[[[-5.95,54.55],[-5.85,54.55],[-5.85,54.62],[-5.95,54.62],[-5.95,54.55]]]}',
    });

    component.onBroadcast();

    expect(broadcastCalled).toBe(true);
  });
});
