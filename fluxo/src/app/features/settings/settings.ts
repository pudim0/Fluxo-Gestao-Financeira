import { Component } from '@angular/core';
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
          <p class="page-kicker">Configurações</p>
          <h2 class="page-title">Perfil, preferências e acessibilidade</h2>
          <p class="page-copy">
            O painel de configurações vai concentrar personalização, conta e
            comportamento da interface.
          </p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card eyebrow="Perfil" title="Dados da conta" subtitle="Campos base para personalização e contato.">
          <div class="stack">
            <ds-input label="Nome" placeholder="Seu nome" />
            <ds-input label="E-mail" type="email" placeholder="voce@empresa.com" />
          </div>
        </ds-card>

        <ds-card eyebrow="Preferências" title="Interface" subtitle="Configurações que podem virar toggles reais depois.">
          <div class="tag-row">
            <span class="tag">Tema escuro</span>
            <span class="tag">Modo compacto</span>
            <span class="tag">Atalhos de teclado</span>
          </div>
        </ds-card>
      </section>

      <section class="page-grid page-grid--single">
        <ds-card eyebrow="Salvar" title="Persistência futura">
          <div class="page-actions">
            <ds-button>Salvar alterações</ds-button>
            <ds-button variant="secondary">Cancelar</ds-button>
          </div>
        </ds-card>
      </section>
    </section>
  `
})
export class Settings {}
