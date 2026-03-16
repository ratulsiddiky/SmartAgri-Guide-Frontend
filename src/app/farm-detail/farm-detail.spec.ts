import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDetail } from './farm-detail';

describe('FarmDetail', () => {
  let component: FarmDetail;
  let fixture: ComponentFixture<FarmDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
