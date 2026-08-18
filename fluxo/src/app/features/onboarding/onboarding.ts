import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card as DsCard } from '../../shared/components/design-system/card/card';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [RouterLink, DsCard],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Onboarding</p>
          <h2 class="page-title">Organize sua vida financeira em poucos passos</h2>
          <p class="page-copy">
            O primeiro acesso apresenta os dados, conecta as origens e prepara o terreno para o
            login seguro e o dashboard operacional.
          </p>
        </div>

        <div class="page-actions">
          <a class="secondary-button" routerLink="/login">Ir para login</a>
          <a class="primary-button" routerLink="/dashboard">Explorar dashboard</a>
        </div>
      </header>

      <section class="page-grid">
        <ds-card
          eyebrow="Etapa 1"
          title="Conectar fontes"
          subtitle="Bancos, cartões e carteiras começam aqui."
        >
          <div class="tag-row">
            <span class="tag">Open Finance</span>
            <span class="tag">Importação manual</span>
            <span class="tag">Sincronização segura</span>
          </div>
        </ds-card>

        <ds-card
          eyebrow="Etapa 2"
          title="Definir prioridades"
          subtitle="Escolha metas e categorias-chave para o app."
        >
          <div class="tag-row">
            <span class="tag">Metas</span>
            <span class="tag">Orçamento</span>
            <span class="tag">Relatórios</span>
          </div>
        </ds-card>
      </section>

      <section class="page-grid page-grid--single">
        <ds-card
          eyebrow="Etapa 3"
          title="Ativar a rotina"
          subtitle="O painel finaliza a configuração inicial."
        >
          <p class="page-copy">
            Depois desse fluxo, o usuário entra no dashboard com contexto, preferências e alertas já
            organizados.
          </p>
        </ds-card>
      </section>
    </section>
  `,
})
export class Onboarding {}
