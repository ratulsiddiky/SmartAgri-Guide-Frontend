import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerDirective } from './loading-spinner.directive';

@Component({
  standalone: true,
  imports: [LoadingSpinnerDirective],
  template: `<div id="container" [appLoadingSpinner]="loading">Body</div>`,
})
class HostComponent {
  loading = true;
}

describe('LoadingSpinnerDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('shows spinner overlay while loading', () => {
    const host = fixture.nativeElement.querySelector('#container') as HTMLElement;
    expect(host.querySelector('.spinner-border')).toBeTruthy();
  });
});
