import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appFormError]',
  standalone: true,
})
export class FormErrorDirective implements DoCheck {
  @Input('appFormError') control: AbstractControl | null = null;
  @Input() appFormErrorMessages: Record<string, string> = {};

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngDoCheck(): void {
    const host = this.elementRef.nativeElement;
    const shouldShow = !!(
      this.control &&
      this.control.touched &&
      this.control.invalid &&
      this.control.errors
    );

    if (!shouldShow) {
      this.renderer.setStyle(host, 'display', 'none');
      this.renderer.setProperty(host, 'textContent', '');
      this.renderer.setProperty(host, 'innerText', '');
      this.renderer.removeAttribute(host, 'title');
      return;
    }

    const message = this.getMessage(this.control?.errors || null);
    this.renderer.setStyle(host, 'display', 'block');
    this.renderer.addClass(host, 'text-danger');
    this.renderer.addClass(host, 'small');
    this.renderer.addClass(host, 'mt-1');
    this.renderer.setProperty(host, 'textContent', message);
    this.renderer.setProperty(host, 'innerText', message);
    this.renderer.setAttribute(host, 'title', message);
  }

  private getMessage(errors: ValidationErrors | null): string {
    if (!errors) {
      return '';
    }

    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) {
      return '';
    }

    const configuredMessage = this.appFormErrorMessages[firstErrorKey];
    if (configuredMessage) {
      return configuredMessage;
    }

    if (firstErrorKey === 'required') {
      return 'This field is required.';
    }
    if (firstErrorKey === 'email') {
      return 'Please enter a valid email address.';
    }
    if (firstErrorKey === 'minlength') {
      const requiredLength = (errors['minlength'] as { requiredLength?: number })
        ?.requiredLength;
      return requiredLength
        ? `Please enter at least ${requiredLength} characters.`
        : 'Input is too short.';
    }
    if (firstErrorKey === 'maxlength') {
      const requiredLength = (errors['maxlength'] as { requiredLength?: number })
        ?.requiredLength;
      return requiredLength
        ? `Please use no more than ${requiredLength} characters.`
        : 'Input is too long.';
    }
    if (firstErrorKey === 'pattern') {
      return 'Please enter a valid value.';
    }

    return 'Please check this field.';
  }
}
