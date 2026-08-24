import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationCenterService } from '../../services/notification-center.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslatePipe,
  ],
  templateUrl: './app-shell.html',
})
export class AppShell {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationCenter = inject(NotificationCenterService);

  // State Signals
  protected readonly sidebarOpen = signal(false);
  protected readonly settingsOpen = signal(false);
  protected readonly theme = signal<'dark' | 'light'>(this.readTheme());

  // Convert Router events into a reactive Signal safely
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly unreadNotifications = computed(
    () => this.notificationCenter.notifications().filter((item) => !item.read).length
  );

  // Navigation Config (Standardized with i18n keys)
  protected readonly navigation: NavItem[] = [
    { label: 'settings.tituloPaginaDashboard', icon: '▦', route: '/dashboard' },
    { label: 'settings.tituloPaginaTransacoes', icon: '↕', route: '/transacoes' },
    { label: 'settings.tituloOrcamento', icon: '◫', route: '/orcamento' },
    { label: 'settings.tituloPaginaConfigRelatorios', icon: '⌁', route: '/relatorios' },
    { label: 'settings.tituloPaginaMetas', icon: '◎', route: '/metas' },
  ];

  // Derived Title Signal
  protected readonly mensagem = computed(() => {
    const url = this.currentUrl();
    const matchedItem = this.navigation.find((item) => url.startsWith(item.route));

    if (matchedItem) return matchedItem.label;
    if (url.startsWith('/configuracoes')) return 'settings.tituloPaginaConfig';
    if (url.startsWith('/notificacoes')) return 'nav.notificacoes';

    return 'app.visaoGeral';
  });

  constructor() {
    this.applyTheme(this.theme());
  }

  // User Actions
  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected toggleSettings(): void {
    this.settingsOpen.update((open) => !open);
  }

  protected closeSettings(): void {
    this.settingsOpen.set(false);
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.applyTheme(next);

    try {
      localStorage.setItem('fluxo.theme', next);
    } catch {
      // Storage unavailable in restricted/test environments
    }
  }

  protected logout(): void {
    this.closeSettings();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.closeSidebar();
    this.closeSettings();
  }

  // Theme Helpers
  private readTheme(): 'dark' | 'light' {
    try {
      const stored = localStorage.getItem('fluxo.theme');
      return stored === 'light' || stored === 'dark' ? stored : 'dark';
    } catch {
      return 'dark';
    }
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}