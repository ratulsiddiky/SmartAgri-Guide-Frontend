import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableWhileLoadingDirective } from './disable-while-loading.directive';

@Component({
  standalone: true,
  imports: [DisableWhileLoadingDirective],
  template: `<button id="btn" [appDisableWhileLoading]="loading">Save</button>`,
})
class HostComponent {
  loading = true;
}

describe('DisableWhileLoadingDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('disables host element when loading is true', () => {
    const button = fixture.nativeElement.querySelector('#btn') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
