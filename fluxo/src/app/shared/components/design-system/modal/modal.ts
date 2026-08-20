import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'ds-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="ds-modal__backdrop" (click)="close.emit()">
        <section
          class="ds-modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          (click)="$event.stopPropagation()"
        >
          <header class="ds-modal__header">
            <div>
              @if (eyebrow()) {
                <p class="ds-modal__eyebrow">{{ eyebrow() }}</p>
              }
              <h3 class="ds-modal__title">{{ title() }}</h3>
            </div>

            <button
              type="button"
              class="ds-modal__close"
              (click)="close.emit()"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </header>

          <div class="ds-modal__body">
            <ng-content />
          </div>
        </section>
      </div>
    }
  `,
})
export class Modal {
  readonly open = input(false);
  readonly title = input('Modal');
  readonly eyebrow = input('');
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.close.emit();
    }
  }
}
