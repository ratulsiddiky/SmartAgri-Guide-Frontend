import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTrimInput]',
  standalone: true,
})
export class TrimInputDirective {
  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>
  ) {}

  @HostListener('blur')
  onBlur(): void {
    const input = this.elementRef.nativeElement;
    const trimmedValue = input.value.trim();

    if (trimmedValue === input.value) {
      return;
    }

    input.value = trimmedValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
