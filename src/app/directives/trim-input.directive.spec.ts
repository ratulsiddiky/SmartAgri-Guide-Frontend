import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TrimInputDirective } from './trim-input.directive';

@Component({
  standalone: true,
  imports: [FormsModule, TrimInputDirective],
  template: `<input id="field" [(ngModel)]="value" appTrimInput />`,
})
class HostComponent {
  value = '  abc  ';
}

describe('TrimInputDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('trims input value on blur', () => {
    const input = fixture.nativeElement.querySelector('#field') as HTMLInputElement;
    input.value = '  value  ';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('value');
  });
});
