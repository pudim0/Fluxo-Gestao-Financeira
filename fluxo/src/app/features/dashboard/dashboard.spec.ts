import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard';
import { TransactionsService } from '../../services/transactions.service';
import { MockTransactionRepository } from '../../repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../../repositories/transaction.repository';

describe('Componente do painel', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    localStorage.removeItem('fluxo.mock.transactions:anonymous');
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        TransactionsService,
        { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar cartões de métricas', () => {
    const metrics = fixture.nativeElement.querySelectorAll('.metric-card');
    expect(metrics.length).toBeGreaterThan(0);
  });

  it('deve renderizar os painéis de visão geral do modelo do painel', () => {
    const overviewPanel = fixture.nativeElement.querySelector('.overview-panel');
    const insightsPanel = fixture.nativeElement.querySelector('.insights-panel');

    expect(overviewPanel).toBeTruthy();
    expect(insightsPanel).toBeTruthy();
  });

  it('exibe somente três transações recentes na prévia do painel', () => {
    const rows = fixture.nativeElement.querySelectorAll('.transaction-row');
    expect(rows.length).toBe(3);
  });

  it('renderiza links rápidos para notificações, transações e metas', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('.alert-links a'),
    ) as HTMLAnchorElement[];

    expect(links.length).toBe(3);
    expect(links[0].getAttribute('href')).toContain('/notificacoes');
    expect(links[1].getAttribute('href')).toContain('/transacoes');
    expect(links[2].getAttribute('href')).toContain('/metas');
  });
});
