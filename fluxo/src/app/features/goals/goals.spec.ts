import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { GoalsComponent } from './goals';

describe('Componente de metas', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [GoalsComponent],
      providers: [
        provideTranslateService(),
        {
          provide: AuthService,
          useValue: {
            getCurrentUserEmail: () => null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve mostrar a dica do gráfico quando um ponto é selecionado', () => {
    const chartPoint = fixture.nativeElement.querySelectorAll('circle')[2] as SVGCircleElement;

    chartPoint.dispatchEvent(new MouseEvent('mouseenter'));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.chart-tooltip')?.textContent).toContain(
      component.chartData()[2].month,
    );

    expect(fixture.nativeElement.querySelector('.chart-tooltip')?.textContent).toContain(
      component.chartPoints()[2].value,
    );
  });

  it('deve adicionar e remover contribuições', () => {
    const savedBefore = component.goals()[0].saved;

    component.addContribution(component.goals()[0].id, 300);

    expect(component.goals()[0].saved).toBe(savedBefore + 300);

    component.removeContribution(component.goals()[0].id, 500);

    expect(component.goals()[0].saved).toBe(savedBefore - 200);
  });

  it('deve adicionar uma nova meta com valor economizado igual a zero', () => {
    component.addGoal('Celular novo', 3000, 150, '2027-12');

    expect(component.goals().at(-1)?.name).toBe('Celular novo');
    expect(component.goals().at(-1)?.saved).toBe(0);
  });

  it('deve persistir alterações das metas no armazenamento local', () => {
    component.addContribution(component.goals()[0].id, 300);

    const savedState = JSON.parse(localStorage.getItem('fluxo.goals:anonymous') ?? '[]');

    expect(savedState[0].saved).toBe(12300);
  });
});
