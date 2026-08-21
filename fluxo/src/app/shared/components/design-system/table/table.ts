import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-table',
  standalone: true,
  template: `
    <div class="ds-table__wrap">
      <table class="ds-table">
        <thead>
          <tr>
            @for (column of columns(); track column) {
              <th>{{ column }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track $index) {
            <tr>
              @for (cell of row; track $index) {
                <td>{{ cell }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Table {
  readonly columns = input<string[]>([]);
  readonly rows = input<string[][]>([]);
}
