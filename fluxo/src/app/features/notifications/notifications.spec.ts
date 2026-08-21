import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notifications } from './notifications';

describe('Notifications', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifications],
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the notification feed', () => {
    const title = fixture.nativeElement.querySelector('.notifications-title-wrap h1');
    const summaryCards = fixture.nativeElement.querySelectorAll('.summary-card');
    const cards = fixture.nativeElement.querySelectorAll('.notification-item');

    expect(title.textContent).toContain('Notificações');
    expect(summaryCards.length).toBe(4);
    expect(cards.length).toBe(4);
  });

  it('should expose the list of notifications in the component', () => {
    expect(component.notifications().length).toBe(4);
    expect(component.notifications()[0].title).toContain('Limite de gasto atingido');
    expect(component.notifications()[3].category).toBe('Lembretes');
  });
});
