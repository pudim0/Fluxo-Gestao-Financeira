import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-card',
  standalone: true,
  template: `
    <section class="ds-card" [class.ds-card--accent]="tone() === 'accent'">
      @if (eyebrow() || title() || subtitle()) {
        <header class="ds-card__header">
          @if (eyebrow()) {
            <p class="ds-card__eyebrow">{{ eyebrow() }}</p>
          }
          <h3 class="ds-card__title">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="ds-card__subtitle">{{ subtitle() }}</p>
          }
        </header>
      }

      <div class="ds-card__body">
        <ng-content />
      </div>
    </section>
  `,
})
export class Card {
  readonly eyebrow = input('');
  readonly title = input('');
  readonly subtitle = input('');
  readonly tone = input<'default' | 'accent'>('default');
}
