import { Component, output, input } from '@angular/core';

@Component({
  selector: 'ds-empty-state',
  standalone: true,
  template: `
    <section class="ds-empty">
      <div class="ds-empty__icon" aria-hidden="true">∅</div>
      <h3 class="ds-empty__title">{{ title() }}</h3>
      <p class="ds-empty__description">{{ description() }}</p>
      @if (actionLabel()) {
        <button type="button" class="ds-empty__action" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </section>
  `
})
export class EmptyState {
  readonly title = input('Sem dados');
  readonly description = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
