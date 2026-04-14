import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appDisableWhileLoading]',
  standalone: true,
})
export class DisableWhileLoadingDirective implements OnChanges {
  @Input('appDisableWhileLoading') loading = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!('loading' in changes)) {
      return;
    }

    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', this.loading);
    if (this.loading) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'aria-disabled',
        'true'
      );
      return;
    }

    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-disabled');
  }
}
