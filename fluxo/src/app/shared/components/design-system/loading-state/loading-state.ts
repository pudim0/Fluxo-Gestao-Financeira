import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-loading-state',
  standalone: true,
  template: `
    <section class="ds-loading" aria-live="polite" aria-busy="true">
      <span class="ds-loading__spinner" aria-hidden="true"></span>
      <div>
        <strong class="ds-loading__title">{{ label() }}</strong>
        @if (detail()) {
          <p class="ds-loading__detail">{{ detail() }}</p>
        }
      </div>
    </section>
  `
})
export class LoadingState {
  readonly label = input('Carregando');
  readonly detail = input('');
}
