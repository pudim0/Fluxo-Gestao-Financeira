import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.html',
})
export class AppShell {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  protected readonly theme = signal<'dark' | 'light'>(this.readTheme());
  protected readonly sidebarOpen = signal(false);
  protected readonly navigation = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Transações', route: '/transacoes' },
    { label: 'Orçamento', route: '/orcamento' },
    { label: 'Relatórios', route: '/relatorios' },
    { label: 'Metas', route: '/metas' },
    { label: 'Configurações', route: '/configuracoes' },
  ];
  constructor() {
    this.applyTheme(this.theme());
  }
  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('fluxo.theme', next);
    this.applyTheme(next);
  }
  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }
  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
  @HostListener('window:keydown.escape') protected onEscape(): void {
    this.closeSidebar();
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
