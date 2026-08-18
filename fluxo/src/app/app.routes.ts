import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { AppShell } from './layout/app-shell/app-shell';
import { Dashboard } from './features/dashboard/dashboard';
import { Onboarding } from './features/onboarding/onboarding';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    canMatch: [guestGuard],
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    canMatch: [guestGuard],
    loadComponent: () => import('./features/auth/register').then((m) => m.Register),
  },
  {
    path: 'recuperar-senha',
    canMatch: [guestGuard],
    loadComponent: () =>
      import('./features/auth/password-recovery').then((m) => m.PasswordRecovery),
  },
  {
    path: 'onboarding',
    component: Onboarding,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: '',
    canMatch: [authGuard],
    component: AppShell,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./features/onboarding/onboarding').then((m) => m.Onboarding),
      },
      {
        path: 'transacoes',
        loadComponent: () =>
          import('./features/transactions/transactions').then((m) => m.Transactions),
      },
      {
        path: 'orcamento',
        loadComponent: () => import('./features/budget/budget').then((m) => m.Budget),
      },
      {
        path: 'relatorios',
        loadComponent: () => import('./features/reports/reports').then((m) => m.Reports),
      },
      { path: 'metas', loadComponent: () => import('./features/goals/goals').then((m) => m.Goals) },
      {
        path: 'configuracoes',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'notificacoes',
        loadComponent: () =>
          import('./features/notifications/notifications').then((m) => m.Notifications),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
