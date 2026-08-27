import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsComponent } from './goals';

describe('GoalsComponent', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [GoalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
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
    expect(fixture.nativeElement.querySelector('.chart-tooltip')?.textContent).toContain(component.chartPoints()[2].value);
  });

  it('should add and remove contributions', () => {
    const savedBefore = component.goals()[0].saved;
    component.addContribution(component.goals()[0].id, 300);
    expect(component.goals()[0].saved).toBe(savedBefore + 300);

    component.removeContribution(component.goals()[0].id, 500);

    expect(component.goals()[0].saved).toBe(savedBefore - 200);
  });

  it('should add a new goal with zero saved amount', () => {
    component.addGoal('Celular novo', 3000, 150, '2027-12');

    expect(component.goals().at(-1)?.name).toBe('Celular novo');
    expect(component.goals().at(-1)?.saved).toBe(0);
  });

  it('should persist goal changes in local storage', () => {
    component.addContribution(component.goals()[0].id, 300);

    const savedState = JSON.parse(localStorage.getItem('fluxo.goals:anonymous') ?? '[]');

    expect(savedState[0].saved).toBe(12300);
  });
});