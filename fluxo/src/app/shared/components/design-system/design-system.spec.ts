import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Input } from './input/input';
import { Modal } from './modal/modal';
import { Table } from './table/table';

describe('Design system components', () => {
  it('renders input configuration and emits typed values', async () => {
    await TestBed.configureTestingModule({ imports: [Input] }).compileComponents();
    const fixture = TestBed.createComponent(Input);
    fixture.componentRef.setInput('label', 'Nome');
    fixture.componentRef.setInput('helperText', 'Obrigatório');
    fixture.componentRef.setInput('placeholder', 'Seu nome');
    fixture.componentRef.setInput('value', 'Ana');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(fixture.nativeElement.textContent).toContain('Obrigatório');
    expect(input.value).toBe('Ana');
    let emitted = '';
    fixture.componentInstance.valueChange.subscribe((value) => (emitted = value));
    input.value = 'Bruna';
    input.dispatchEvent(new Event('input'));
    expect(emitted).toBe('Bruna');
  });

  it('renders modal content and emits close from button, backdrop and escape', async () => {
    await TestBed.configureTestingModule({ imports: [Modal] }).compileComponents();
    const fixture: ComponentFixture<Modal> = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', 'Confirmação');
    fixture.componentRef.setInput('eyebrow', 'Ação');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Confirmação');
    let closes = 0;
    fixture.componentInstance.close.subscribe(() => closes++);
    fixture.nativeElement.querySelector('.ds-modal__close').click();
    fixture.nativeElement.querySelector('.ds-modal__backdrop').click();
    fixture.componentInstance.onEscape();
    expect(closes).toBe(3);
  });

  it('renders table headers and cells, including an empty table', async () => {
    await TestBed.configureTestingModule({ imports: [Table] }).compileComponents();
    const fixture = TestBed.createComponent(Table);
    fixture.componentRef.setInput('columns', ['Nome', 'Valor']);
    fixture.componentRef.setInput('rows', [['Mercado', 'R$ 10'], ['Luz', 'R$ 20']]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('th')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(2);
    fixture.componentRef.setInput('rows', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(0);
  });
});