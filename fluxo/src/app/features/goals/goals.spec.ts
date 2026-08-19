import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Goals } from './goals';

describe('Goals', () => {
  let component: Goals;
  let fixture: ComponentFixture<Goals>;

  beforeEach(async () => {
    localStorage.removeItem('fluxo.goals.state');
    await TestBed.configureTestingModule({
      imports: [Goals],
    }).compileComponents();

    fixture = TestBed.createComponent(Goals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a chart tooltip when a point is selected', () => {
    const chartPoint = fixture.nativeElement.querySelectorAll('circle')[2] as SVGCircleElement;
    chartPoint.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.chart-tooltip')?.textContent).toContain(component.chartData()[2].month);
    expect(fixture.nativeElement.querySelector('.chart-tooltip')?.textContent).toContain('9.500');
  });

  it('should recalculate the line when monthly values change', () => {
    const initialPolyline = fixture.nativeElement.querySelector('polyline').getAttribute('points');
    component.chartValues.set([1000, 2200, 900]);
    fixture.detectChanges();

    const updatedPolyline = fixture.nativeElement.querySelector('polyline').getAttribute('points');

    expect(updatedPolyline).not.toBe(initialPolyline);
    expect(fixture.nativeElement.querySelectorAll('.chart-labels small')).toHaveLength(3);
  });

  it('should answer questions about the emergency reserve', () => {
    component.askFinancialAssistant('Como está minha reserva de emergência?');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.assistant-response')?.textContent).toContain('R$');
    expect(fixture.nativeElement.querySelector('.assistant-response')?.textContent).toContain('40%');
  });

  it('should add a contribution and update the saved total', () => {
    const savedBefore = component.goals()[0].saved;
    const chartBefore = component.chartData().at(-1)?.value;
    component.addContribution(component.goals()[0].id, 300);

    expect(component.goals()[0].saved).toBe(savedBefore + 300);
    expect(component.chartData().at(-1)?.value).toBe((chartBefore ?? 0) + 300);
  });

  it('should remove only the requested amount from a goal', () => {
    const savedBefore = component.goals()[0].saved;
    component.removeContribution(component.goals()[0].id, 500);

    expect(component.goals()[0].saved).toBe(savedBefore - 500);
    expect(component.monthlySaved()).toBe(550);
  });

  it('should add a new goal with zero saved amount', () => {
    component.addGoal('Celular novo', 3000, 150, '2027-12');

    expect(component.goals().at(-1)?.name).toBe('Celular novo');
    expect(component.goals().at(-1)?.saved).toBe(0);
  });

  it('should persist goal changes in local storage', () => {
    component.addContribution(component.goals()[0].id, 300);

    const savedState = JSON.parse(localStorage.getItem('fluxo.goals.state') ?? '{}');

    expect(savedState.goals[0].saved).toBe(2400);
    expect(savedState.monthlySaved).toBe(1350);
  });
});