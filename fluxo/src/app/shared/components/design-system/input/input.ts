import { Component, output, input } from '@angular/core';

@Component({
  selector: 'ds-input',
  standalone: true,
  template: `
    <label class="ds-field">
      <span class="ds-field__label">{{ label() }}</span>
      <input
        class="ds-field__input"
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        (input)="emitValue($event)"
      />
      @if (helperText()) {
        <small class="ds-field__helper">{{ helperText() }}</small>
      }
    </label>
  `
})
export class Input {
  readonly label = input('Campo');
  readonly placeholder = input('');
  readonly helperText = input('');
  readonly type = input('text');
  readonly value = input('');
  readonly disabled = input(false);
  readonly valueChange = output<string>();

  emitValue(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
