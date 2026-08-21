import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Dashboard } from './dashboard';
import { TransactionsService } from '../../services/transactions.service';
import { MockTransactionRepository } from '../../repositories/mock-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../../repositories/transaction.repository';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    localStorage.removeItem('fluxo.mock.transactions');
    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterTestingModule],
      providers: [
        TransactionsService,
        { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
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
});
