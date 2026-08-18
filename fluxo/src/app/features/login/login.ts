import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button as DsButton } from '../../shared/components/design-system/button/button';
import { Card as DsCard } from '../../shared/components/design-system/card/card';
import { Input as DsInput } from '../../shared/components/design-system/input/input';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, DsButton, DsCard, DsInput],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div>
          <p class="page-kicker">Login</p>
          <h2 class="page-title">Acesse sua conta do Fluxo</h2>
          <p class="page-copy">
            Esta tela já está pronta para receber autenticação real, validação e integração com a
            proteção de rotas.
          </p>
        </div>
      </header>

      <section class="page-grid">
        <ds-card
          eyebrow="Entrar"
          title="Credenciais"
          subtitle="Campos prontos para o fluxo de autenticação."
        >
          <form class="stack" (ngSubmit)="entrar()">
            <ds-input label="E-mail" type="email" placeholder="voce@empresa.com" />
            <ds-input label="Senha" type="password" placeholder="••••••••" />
            <div class="page-actions">
              <ds-button type="submit">Entrar no painel</ds-button>
              <ds-button type="button" variant="secondary">Esqueci a senha</ds-button>
            </div>
          </form>
        </ds-card>

        <ds-card
          eyebrow="Segurança"
          title="Base pronta"
          subtitle="Autenticação, interceptor e guarda entram no próximo passo."
        >
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-top">
                <span>JWT</span>
                <span>Planejado</span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width: 18%"></div></div>
            </div>
            <div class="progress-item">
              <div class="progress-top">
                <span>Proteção de rotas</span>
                <span>Planejado</span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width: 12%"></div></div>
            </div>
          </div>
        </ds-card>
      </section>

      <section class="page-grid page-grid--single">
        <ds-card eyebrow="Navegação" title="Retorno ao fluxo inicial">
          <p class="page-copy">
            Se quiser revisar o primeiro contato, volte para o onboarding ou siga direto para o
            dashboard.
          </p>
          <div class="page-actions">
            <a class="secondary-button" routerLink="/onboarding">Voltar ao onboarding</a>
            <a class="primary-button" routerLink="/dashboard">Ir ao dashboard</a>
          </div>
        </ds-card>
      </section>
    </section>
  `,
})
export class Login {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected entrar(): void {
    this.authService.login();

    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/dashboard';
    void this.router.navigateByUrl(redirectTo);
  }
}
