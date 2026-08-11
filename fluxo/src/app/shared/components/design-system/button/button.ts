import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-button',
  standalone: true,
  template: `
    <button
      class="ds-button"
      [class.ds-button--secondary]="variant() === 'secondary'"
      [class.ds-button--ghost]="variant() === 'ghost'"
      [class.ds-button--block]="block()"
      [type]="type()"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `
})
export class Button {
  readonly variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly block = input(false);
  readonly disabled = input(false);
}
