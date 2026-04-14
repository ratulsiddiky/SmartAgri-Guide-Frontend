import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appLoadingSpinner]',
  standalone: true,
})
export class LoadingSpinnerDirective implements OnChanges {
  @Input('appLoadingSpinner') loading = false;

  private overlayElement: HTMLElement | null = null;

  constructor(
    private readonly hostRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!('loading' in changes)) {
      return;
    }

    if (this.loading) {
      this.attachOverlay();
      return;
    }

    this.detachOverlay();
  }

  private attachOverlay(): void {
    if (this.overlayElement) {
      return;
    }

    const host = this.hostRef.nativeElement;
    this.renderer.setStyle(host, 'position', 'relative');

    const overlay = this.renderer.createElement('div');
    this.renderer.setStyle(overlay, 'position', 'absolute');
    this.renderer.setStyle(overlay, 'inset', '0');
    this.renderer.setStyle(overlay, 'display', 'flex');
    this.renderer.setStyle(overlay, 'alignItems', 'center');
    this.renderer.setStyle(overlay, 'justifyContent', 'center');
    this.renderer.setStyle(overlay, 'background', 'rgba(255, 255, 255, 0.7)');
    this.renderer.setStyle(overlay, 'zIndex', '10');
    this.renderer.setAttribute(overlay, 'aria-live', 'polite');
    this.renderer.setAttribute(overlay, 'aria-label', 'Loading');

    const spinner = this.renderer.createElement('span');
    this.renderer.addClass(spinner, 'spinner-border');
    this.renderer.addClass(spinner, 'text-success');
    this.renderer.setAttribute(spinner, 'role', 'status');
    this.renderer.setAttribute(spinner, 'aria-hidden', 'true');
    this.renderer.appendChild(overlay, spinner);

    this.renderer.appendChild(host, overlay);
    this.overlayElement = overlay;
  }

  private detachOverlay(): void {
    if (!this.overlayElement) {
      return;
    }

    this.renderer.removeChild(this.hostRef.nativeElement, this.overlayElement);
    this.overlayElement = null;
  }
}
