import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Button as DsButton } from '../../shared/components/design-system/button/button';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { Input as DsInput } from '../../shared/components/design-system/input/input';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DsButton, DsCard, DsInput, TranslatePipe],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-copy">
            {{ 'settings.descricao' | translate }}
          </p>
          <div class="button-config">
            <ds-button (click)="mostrarAba('perfil')" [class.selecionado]="abaAtiva() === 'perfil'">
              {{ 'settings.perfil' | translate }}
            </ds-button>
            <ds-button
              (click)="mostrarAba('preferencias')"
              [class.selecionado]="abaAtiva() === 'preferencias'"
            >
              {{ 'settings.preferencias' | translate }}
            </ds-button>
            <ds-button
              (click)="mostrarAba('acessibilidade')"
              [class.selecionado]="abaAtiva() === 'acessibilidade'"
            >
              {{ 'settings.acessibilidade' | translate }}
            </ds-button>
          </div>
        </div>
      </header>

      <section class="page-grid">
        @if (abaAtiva() === 'perfil') {
          <ds-card
            eyebrow="{{ 'settings.perfil' | translate }}"
            title="{{ 'settings.dadosConta' | translate }}"
            subtitle="{{ 'settings.dadosContaDescricao' | translate }}"
          >
            <div class="stack">
              <ds-input
                label="{{ 'settings.nome' | translate }}"
                placeholder="Seu nome"
                [value]="nomeAtual()"
                (input)="atualizarNome($event)"
              />
              <ds-input
                label="{{ 'settings.email' | translate }}"
                type="email"
                placeholder="voce@empresa.com"
                [value]="emailAtual()"
                (input)="atualizarEmail($event)"
              />
              <ds-input
                label="{{ 'settings.senhaAntiga' | translate }}"
                type="password"
                placeholder="********"
                [value]="senhaAntiga()"
                (input)="atualizarSenhaAntiga($event)"
              />
              <ds-input
                label="{{ 'settings.novaSenha' | translate }}"
                type="password"
                placeholder="********"
                [value]="novaSenha()"
                (input)="atualizarNovaSenha($event)"
              />
            </div>
          </ds-card>
        }

        @if (abaAtiva() === 'preferencias') {
          <ds-card
            eyebrow="{{ 'settings.preferencias' | translate }}"
            title="{{ 'settings.interface' | translate }}"
            subtitle="{{ 'settings.dadosContaDescricao' | translate }}"
          >
            <div class="linguagens">
              <button
                class="button-linguagem"
                (click)="mudarIdioma('pt-BR')"
                [class.linguagem-atual]="idioma() === 'pt-BR'"
              >
                PT-BR
              </button>
              <button
                class="button-linguagem"
                (click)="mudarIdioma('en')"
                [class.linguagem-atual]="idioma() === 'en'"
              >
                ENG
              </button>
            </div>

            <div class="tag-row">
              <button type="button" class="tag" (click)="toggleTheme()">
                {{
                  theme() === 'dark'
                    ? ('settings.temaClaro' | translate)
                    : ('settings.temaEscuro' | translate)
                }}
              </button>
              <span class="tag">{{ 'settings.modoCompacto' | translate }}</span>
              <span class="tag">{{ 'settings.atalhosTeclado' | translate }}</span>
            </div>
          </ds-card>
        }

        @if (abaAtiva() === 'acessibilidade') {
          <ds-card
            eyebrow="{{ 'settings.acessibilidade' | translate }}"
            title="{{ 'settings.contatoSuporte' | translate }}"
            subtitle="{{ 'settings.dadosContaDescricao' | translate }}"
          >
          </ds-card>
          <div class="button-config">
            <ds-button variant="secondary">E-mail</ds-button>
            <ds-button variant="secondary">WhatsApp</ds-button>
          </div>
        }
      </section>

      <section class="page-grid page-grid--single">
        <ds-card
          eyebrow="{{ 'settings.salvar' | translate }}"
          title="{{ 'settings.msgSalvar' | translate }}"
        >
          <div class="page-actions">
            <ds-button
              [style.opacity]="alterado ? '1' : '0.5'"
              [disabled]="!alterado"
              class="button-save"
              >{{ 'settings.salvarAlteracoes' | translate }}</ds-button
            >
            <ds-button (click)="cancelarAlteracoes()" variant="secondary">{{
              'settings.cancelar' | translate
            }}</ds-button>
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

  private readonly languageService = inject(LanguageService);

  idioma = this.languageService.idioma;

  mudarIdioma(idioma: 'pt-BR' | 'en'): void {
    this.languageService.mudarIdioma(idioma);
  }

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
