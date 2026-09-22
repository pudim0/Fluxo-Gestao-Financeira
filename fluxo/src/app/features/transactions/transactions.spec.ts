import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { Transactions } from './transactions';

describe('Transações', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;
  let service: any;
  const transaction: Transaction = {
    id: '1',
    description: 'Mercado',
    amount: 100,
    type: 'expense',
    category: 'Alimentação',
    date: '2026-09-10',
    account: 'Conta principal',
  };

  beforeEach(async () => {
    service = {
      transactions: signal([transaction]),
      categories: signal(['Alimentação']),
      isLoading: signal(false),
      hasError: signal(false),
      load: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [Transactions],
      providers: [{ provide: TransactionsService, useValue: service }],
    }).compileComponents();
    fixture = TestBed.createComponent(Transactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filtra pela busca e retorna resultado vazio para filtros sem correspondência', () => {
    const instance = component as any;
    expect(instance.filteredTransactions).toHaveLength(1);
    instance.search = 'inexistente';
    expect(instance.filteredTransactions).toEqual([]);
    expect(instance.hasActiveFilters).toBe(true);
    instance.clearFilters();
    expect(instance.filteredTransactions).toHaveLength(1);
  });

  it('calcula os totais de receitas e despesas', () => {
    service.transactions.set([
      transaction,
      { ...transaction, id: '2', type: 'income', amount: 250 },
    ]);
    const instance = component as any;
    expect(instance.filteredIncome).toBe(250);
    expect(instance.filteredExpense).toBe(100);
  });

  it('renderiza os estados de carregamento, erro e vazio', () => {
    service.isLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Carregando transações');
    service.isLoading.set(false);
    service.hasError.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Não foi possível carregar as transações');
    service.hasError.set(false);
    service.transactions.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Comece registrando uma transação');
  });

  it('rejeita formulários inválidos e salva fluxos válidos de criação e edição', () => {
    const instance = component as any;
    instance.startCreate();
    instance.form = { ...instance.form, description: 'x' };
    instance.save();
    expect(instance.feedbackMessage).toContain('pelo menos 3 caracteres');
    instance.form = {
      ...instance.form,
      description: 'Conta',
      amount: 80,
      category: 'Casa',
      account: 'Carteira',
    };
    instance.save();
    expect(service.create).toHaveBeenCalled();
    instance.startEdit(transaction);
    instance.form.description = 'Mercado atualizado';
    instance.save();
    expect(service.update).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ description: 'Mercado atualizado' }),
    );
  });

  it('trata a criação de categorias e a exclusão confirmada', () => {
    const instance = component as any;
    instance.startCreate();
    instance.startNewCategory();
    instance.form.category = '  Viagem  ';
    instance.confirmNewCategory();
    expect(instance.form.category).toBe('Viagem');
    expect(instance.creatingCategory).toBe(false);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    instance.remove(transaction);
    expect(service.delete).toHaveBeenCalledWith('1');
    vi.restoreAllMocks();
  });

  
it('deve mostrar mensagem quando a descrição estiver vazia', () => {
  const instance = component as any; 

  instance.form.description = '';

  instance.save();

  expect(instance.feedbackMessage)
  .toBe('Por favor, informe uma descrição.');

});

it('deve mostrar mensagem quando a descrição tiver menos de 3 caracteres', () => {
const instance  = component as any 

instance.form.description = 'ab';

instance.save();

expect(instance.feedbackMessage)
.toBe('A descrição deve ter pelo menos 3 caracteres.')  
});

it('deve mostrar mensagem quando a data for inválida', () => {
const instance = component as any 

instance.form = {
  ...instance.form,
  description: 'Mercado',
  amount: 100,
  category: 'Alimentação',
  account: 'Conta principal',
  date:'data-invalida',
};

instance.save();

expect(instance.feedbackMessage)
.toBe('Por favor, informe uma data válida.');

});

it('deve mostrar mensagem quando a conta estiver vazia', () => {
  const instance = component as any;

  instance.form = {
    ...instance.form,
    description: 'Mercado',
    amount: 100,
    category: 'Alimentação',
    date: '2026-09-10',
    account:'',
  };
  
  instance.save();

  expect(instance.feedbackMessage)
    .toBe('Por favor, informe a conta.');
});
});


