import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

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

  protected readonly theme = signal<'dark' | 'light'>(this.readTheme());
  protected readonly sidebarOpen = signal(false);
  protected readonly settingsOpen = signal(false);

  protected readonly navigation = [
    {
      label: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'settings.tituloPaginaTransacoes',
      route: '/transacoes',
    },
    {
      label: 'settings.tituloOrcamento',
      route: '/orcamento',
    },
    {
      label: 'settings.tituloPaginaConfigRelatorios',
      route: '/relatorios',
    },
    {
      label: 'settings.tituloPaginaMetas',
      route: '/metas',
    },
  ];

  protected readonly mensagem = signal('app.visaoGeral');

  constructor() {
    this.applyTheme(this.theme());

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;

        this.mensagem.set(this.getMensagem(url));
      });
  }

  private getMensagem(url: string): string {
    if (url.startsWith('/dashboard')) {
      return 'dashboard.titulo';
    }

    if (url.startsWith('/transacoes')) {
      return 'settings.tituloPaginaTransacoes';
    }

    if (url.startsWith('/orcamento')) {
      return 'settings.tituloOrcamento';
    }

    if (url.startsWith('/relatorios')) {
      return 'settings.tituloPaginaConfigRelatorios';
    }

    if (url.startsWith('/metas')) {
      return 'settings.tituloPaginaMetas';
    }

    if (url.startsWith('/configuracoes')) {
      return 'settings.tituloPaginaConfig';
    }

    return 'app.visaoGeral';
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';

    this.theme.set(next);

    try {
      localStorage.setItem('fluxo.theme', next);
    } catch {}

    this.applyTheme(next);
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

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.closeSidebar();
    this.closeSettings();
  }

  private readTheme(): 'dark' | 'light' {
    try {
      const theme = localStorage.getItem('fluxo.theme');

      return theme === 'light' || theme === 'dark'
        ? theme
        : 'dark';
    } catch {
      return 'dark';
    }
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}