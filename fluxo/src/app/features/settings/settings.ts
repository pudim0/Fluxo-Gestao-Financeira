import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Button as DsButton } from '../../shared/components/design-system/button/button';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { Input as DsInput } from '../../shared/components/design-system/input/input';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DsButton, DsCard, DsInput, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  private readonly dummyUserUrl = 'https://dummyjson.com/users/1';

  abaAtiva = signal<'perfil' | 'preferencias' | 'acessibilidade'>('perfil');
  theme = signal<'dark' | 'light'>(this.readTheme());

  nomeOriginal = '';
  emailOriginal = '';
  senhaOriginal = '';

  nomeAtual = signal('');
  emailAtual = signal('');
  senhaAntiga = signal('');
  novaSenha = signal('');

  private readonly languageService = inject(LanguageService);

  idioma = this.languageService.idioma;

  constructor() {
    this.applyTheme(this.theme());
    this.carregarUsuarioFicticio();
  }

  mudarIdioma(idioma: 'pt-BR' | 'en'): void {
    this.languageService.mudarIdioma(idioma);
  }

  cancelarAlteracoes(): void {
    this.nomeAtual.set(this.nomeOriginal);
    this.emailAtual.set(this.emailOriginal);
    this.senhaAntiga.set(this.senhaOriginal);
    this.novaSenha.set(this.senhaOriginal);
  }

  mostrarAba(aba: 'perfil' | 'preferencias' | 'acessibilidade'): void {
    this.abaAtiva.set(aba);
  }

  atualizarNome(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.nomeAtual.set(valor);
  }

  atualizarEmail(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.emailAtual.set(valor);
  }

  atualizarSenhaAntiga(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.senhaAntiga.set(valor);
  }

  atualizarNovaSenha(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.novaSenha.set(valor);
  }

  get alterado(): boolean {
    return (
      this.nomeAtual() !== this.nomeOriginal ||
      this.emailAtual() !== this.emailOriginal ||
      this.senhaAntiga() !== this.senhaOriginal ||
      this.novaSenha() !== this.senhaOriginal
    );
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

  private carregarUsuarioFicticio(): void {
    this.http
      .get<{ firstName: string; lastName: string; email: string }>(this.dummyUserUrl)
      .pipe(catchError(() => of(null)))
      .subscribe((usuario) => {
        if (!usuario) return;

        const nome = `${usuario.firstName} ${usuario.lastName}`.trim();
        this.nomeOriginal = nome;
        this.emailOriginal = usuario.email;
        this.nomeAtual.set(nome);
        this.emailAtual.set(usuario.email);
      });
  }

  // Bug #10, #12 Fix: Implementar salvar alterações
  salvarAlteracoes(): void {
    if (!this.alterado) return;

    this.nomeOriginal = this.nomeAtual();
    this.emailOriginal = this.emailAtual();
    this.senhaOriginal = this.senhaAntiga();

    console.log('Alterações salvas com sucesso!');
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
