import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button as DsButton } from '../../shared/components/design-system/button/button';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { Input as DsInput } from '../../shared/components/design-system/input/input';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DsButton, DsCard, DsInput],
  template: `
  
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-copy">
            Centralize preferências da conta, aparência e recursos de acessibilidade.
          </p>
          <div class="button-config">
              <ds-button (click)="mostrarAba('perfil')">Perfil</ds-button>
              <ds-button (click)="mostrarAba('preferencias')">Preferências</ds-button>
              <ds-button (click)="mostrarAba('acessibilidade')">Acessibilidade</ds-button>
          </div>
        </div>
      </header>

      <section class="page-grid">
        @if (abaAtiva() === 'perfil') {
          <ds-card
            eyebrow="Perfil"
            title="Dados da conta"
            subtitle="Campos base para personalização e contato."
          >
            <div class="stack">
              <ds-input label="Nome" placeholder="Seu nome" [value]="nomeAtual()" (input)="atualizarNome($event)"/>
              <ds-input label="E-mail" type="email" placeholder="voce@empresa.com" [value]="emailAtual()" (input)="atualizarEmail($event)"/>
              <ds-input label="Senha antiga" type="password" placeholder="********" [value]="senhaAntiga()" (input)="atualizarSenhaAntiga($event)"/>
              <ds-input label="Nova senha" type="password" placeholder="********" [value]="novaSenha()" (input)="atualizarNovaSenha($event)"/>
            </div>
          </ds-card>
        }

        @if (abaAtiva() === 'preferencias') {
          <ds-card
            eyebrow="Preferências"
            title="Interface"
            subtitle="Ajustes visuais e de experiência para o seu dia a dia."
          >
            <div class="tag-row">
              <button type="button" class="tag" (click)="toggleTheme()">
                {{ theme() === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro' }}
              </button>
              <span class="tag">Modo compacto</span>
              <span class="tag">Atalhos de teclado</span>
            </div>
          </ds-card>
        }

        @if (abaAtiva() === 'acessibilidade') {
          <ds-card
            eyebrow="Acessibilidade"
            title="Ajustes"
            subtitle="Recursos para tornar a navegação mais confortável."
          >
            
          </ds-card>
        }

      </section>

      <section class="page-grid page-grid--single">
        <ds-card eyebrow="Salvar" title="Substituir dados antigos pelas alterações">
          <div class="page-actions">
            <ds-button [style.opacity]="alterado ? '1' : '0.5'" [disabled]="!alterado" class="button-save">Salvar alterações</ds-button>
            <ds-button (click)="cancelarAlteracoes()" variant="secondary">Cancelar</ds-button>
          </div>
        </ds-card>
      </section>
    </section>
  `,
})

export class Settings {
  private readonly document = inject(DOCUMENT);

  abaAtiva = signal<'perfil' | 'preferencias' | 'acessibilidade'>('perfil');
  theme = signal<'dark' | 'light'>(this.readTheme());

    nomeOriginal = '';
    emailOriginal = '';
    senhaOriginal = '';

    nomeAtual = signal('');
    emailAtual = signal('');
    senhaAntiga = signal('');
    novaSenha = signal('');

    constructor() {
      this.applyTheme(this.theme());
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
}
