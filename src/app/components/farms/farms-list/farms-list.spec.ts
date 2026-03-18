import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmsList } from './farms-list';

describe('FarmsList', () => {
  let component: FarmsList;
  let fixture: ComponentFixture<FarmsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmsList],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
