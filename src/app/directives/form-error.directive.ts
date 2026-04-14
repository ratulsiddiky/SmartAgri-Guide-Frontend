import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { merge, Subscription } from 'rxjs';

@Directive({
  selector: '[appFormError]',
  standalone: true,
})
export class FormErrorDirective implements OnChanges, OnDestroy {
  @Input('appFormError') control: AbstractControl | null = null;
  @Input() appFormErrorMessages: Record<string, string> = {};
  private controlStateSub: Subscription | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('control' in changes) {
      this.subscribeToControlChanges();
    }
    this.renderErrorState();
  }

  ngOnDestroy(): void {
    this.controlStateSub?.unsubscribe();
    this.controlStateSub = null;
  }

  private subscribeToControlChanges(): void {
    this.controlStateSub?.unsubscribe();
    this.controlStateSub = null;

    if (!this.control) {
      return;
    }

    this.controlStateSub = merge(
      this.control.statusChanges,
      this.control.valueChanges,
      this.control.events
    ).subscribe(() => {
      this.renderErrorState();
    });
  }

  private renderErrorState(): void {
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
      this.renderer.removeAttribute(host, 'title');
      return;
    }

    const message = this.getMessage(this.control?.errors || null);
    this.renderer.setStyle(host, 'display', 'block');
    this.renderer.addClass(host, 'text-danger');
    this.renderer.addClass(host, 'small');
    this.renderer.addClass(host, 'mt-1');
    this.renderer.setProperty(host, 'textContent', message);
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
      const minRequiredLength = (errors['minlength'] as { requiredLength?: number })
        ?.requiredLength;
      return minRequiredLength
        ? `Please enter at least ${minRequiredLength} characters.`
        : 'Input is too short.';
    }
    if (firstErrorKey === 'maxlength') {
      const maxAllowedLength = (errors['maxlength'] as { requiredLength?: number })
        ?.requiredLength;
      return maxAllowedLength
        ? `Please use no more than ${maxAllowedLength} characters.`
        : 'Input is too long.';
    }
    if (firstErrorKey === 'pattern') {
      return 'Please enter a valid value.';
    }

    return 'Please check this field.';
  }
}
