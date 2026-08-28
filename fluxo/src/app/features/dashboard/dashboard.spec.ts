import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard';
import { TransactionsService } from '../../services/transactions.service';
import { MockTransactionRepository } from '../../repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../../repositories/transaction.repository';

describe('DashboardComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render metric cards', () => {
    const metrics = fixture.nativeElement.querySelectorAll('.metric-card');
    expect(metrics.length).toBeGreaterThan(0);
  });

  it('should render the overview panels from the dashboard mockup', () => {
    const overviewPanel = fixture.nativeElement.querySelector('.overview-panel');
    const insightsPanel = fixture.nativeElement.querySelector('.insights-panel');

    expect(overviewPanel).toBeTruthy();
    expect(insightsPanel).toBeTruthy();
  });

  it('shows only three recent transactions in the dashboard preview', () => {
    const rows = fixture.nativeElement.querySelectorAll('.transaction-row');
    expect(rows.length).toBe(3);
  });

  it('renders quick links to notificacoes, transacoes and metas', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('.alert-links a'),
    ) as HTMLAnchorElement[];

    expect(links.length).toBe(3);
    expect(links[0].getAttribute('href')).toContain('/notificacoes');
    expect(links[1].getAttribute('href')).toContain('/transacoes');
    expect(links[2].getAttribute('href')).toContain('/metas');
  });
});