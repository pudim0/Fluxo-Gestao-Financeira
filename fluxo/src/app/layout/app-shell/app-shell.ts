import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationCenterService } from '../../services/notification-center.service';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.html',
})
export class AppShell {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationCenter = inject(NotificationCenterService);
  protected readonly sidebarOpen = signal(false);
  protected readonly settingsOpen = signal(false);
  protected readonly unreadNotifications = computed(
    () => this.notificationCenter.notifications().filter((item) => !item.read).length,
  );
  protected readonly navigation = [
    { label: 'Painel', icon: '▦', route: '/dashboard' },
    { label: 'Transações', icon: '↕', route: '/transacoes' },
    { label: 'Orçamento', icon: '◫', route: '/orcamento' },
    { label: 'Metas', icon: '◎', route: '/metas' },
  ];

  protected readonly mensagem = signal('Visão geral');

  constructor() {
    this.applyTheme(this.readTheme());

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.mensagem.set(this.getMensagem(url));
      });
  }

  private getMensagem(url: string): string {
    if (url.startsWith('/dashboard')) {
      return 'Painel';
    }

    if (url.startsWith('/transacoes')) {
      return 'Transações';
    }

    if (url.startsWith('/orcamento')) {
      return 'Orçamento';
    }

    if (url.startsWith('/metas')) {
      return 'Metas';
    }

    if (url.startsWith('/configuracoes')) {
      return 'Configurações';
    }

    if (url.startsWith('/notificacoes')) {
      return 'Notificações';
    }

    return 'Visão geral';
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }
  protected toggleSettings(): void {
    this.settingsOpen.update((open) => !open);
  }
  protected closeSettings(): void {
    this.settingsOpen.set(false);
  }
  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
  protected logout(): void {
    this.closeSettings();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
  @HostListener('window:keydown.escape') protected onEscape(): void {
    this.closeSidebar();
    this.closeSettings();
  }
  private readTheme(): 'dark' | 'light' {
    try {
      const theme = localStorage.getItem('fluxo.theme');
      return theme === 'light' || theme === 'dark' ? theme : 'dark';
    } catch {
      return 'dark';
    }
  }
  private applyTheme(theme: 'dark' | 'light'): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
