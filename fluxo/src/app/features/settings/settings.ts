import { Component, signal } from '@angular/core';
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
            O painel de configurações vai concentrar personalização, conta e comportamento da
            interface.
          </p>
          <br>
          <div class="button-config">
              <ds-button (click)="mostrarAba('perfil')">Perfil</ds-button>
              <ds-button (click)="mostrarAba('preferencias')">Preferências</ds-button>
              <ds-button (click)="mostrarAba('acessibilidade')">Acessibilidade</ds-button>
          </div>
        </div>
      </header>

      /* add contato em acessibilidade */
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
            subtitle="Configurações que podem virar toggles reais depois."
          >
            <div class="tag-row">
              <span class="tag">Tema escuro</span>
              <span class="tag">Modo compacto</span>
              <span class="tag">Atalhos de teclado</span>
            </div>
          </ds-card>
        }

        @if (abaAtiva() === 'acessibilidade') {
          <ds-card
            eyebrow="Acessibilidade"
            title="Ajustes"
            subtitle="Configurações que podem virar toggles reais depois."
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
  abaAtiva = signal<'perfil' | 'preferencias' | 'acessibilidade'>('perfil');

    nomeOriginal = '';
    emailOriginal = '';
    senhaOriginal = '';

    nomeAtual = signal('');
    emailAtual = signal('');
    senhaAntiga = signal('');
    novaSenha = signal('');

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
}
