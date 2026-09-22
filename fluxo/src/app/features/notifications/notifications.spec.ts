import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notifications } from './notifications';

describe('Notificações', () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;

  beforeEach(async () => {
    localStorage.removeItem('fluxo.notifications:anonymous');
    await TestBed.configureTestingModule({
      imports: [Notifications],
    }).compileComponents();

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o feed de notificações', () => {
    const title = fixture.nativeElement.querySelector('.notifications-title-wrap h1');
    const summaryCards = fixture.nativeElement.querySelectorAll('.summary-card');
    const cards = fixture.nativeElement.querySelectorAll('.notification-item');

    expect(title.textContent).toContain('Notificações');
    expect(summaryCards.length).toBe(4);
    expect(cards.length).toBe(4);
  });

  it('deve disponibilizar a lista de notificações no componente', () => {
    expect(component.notifications().length).toBe(4);
    expect(component.notifications()[0].title).toContain('Limite de gasto atingido');
    expect(component.notifications()[3].category).toBe('Lembretes');
  });

  it('marca uma única notificação como lida', () => {
    component.markAsRead(1);

    expect(component.notifications().find((item) => item.id === 1)?.read).toBe(true);
    expect(component.unreadCount()).toBe(3);
  });

  it('marca todas as notificações como lidas', () => {
    component.markAllAsRead();

    expect(component.notifications().every((item) => item.read)).toBe(true);
    expect(component.unreadCount()).toBe(0);
  });
});
