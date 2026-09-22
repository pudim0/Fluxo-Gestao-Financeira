import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button as DsButton } from '../../shared/components/design-system/button/button';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DsButton, DsCard, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly document = inject(DOCUMENT);
  abaAtiva = signal<'preferencias' | 'acessibilidade'>('preferencias');
  theme = signal<'dark' | 'light'>(this.readTheme());

  private readonly languageService = inject(LanguageService);

  idioma = this.languageService.idioma;

  constructor() {
    this.applyTheme(this.theme());
  }

  mudarIdioma(idioma: 'pt-BR' | 'en'): void {
    this.languageService.mudarIdioma(idioma);
  }

  mostrarAba(aba: 'preferencias' | 'acessibilidade'): void {
    this.abaAtiva.set(aba);
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try {
      localStorage.setItem('fluxo.theme', next);
    } catch {}
    this.applyTheme(next);
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

  // Bug #5 Fix: Adicionar suporte a contato via email/WhatsApp
  contactSupport(channel: 'email' | 'whatsapp'): void {
    const email = 'suporte@fluxo.local';

    if (channel === 'email') {
      window.open(`mailto:${email}`, '_blank');
    } else if (channel === 'whatsapp') {
      const message = 'Olá! Preciso de ajuda com o aplicativo Fluxo';
      window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
    }
  }
}
