import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'onboarding',
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./features/onboarding/onboarding').then((m) => m.Onboarding),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'transacoes',
    canMatch: [authGuard],
    loadComponent: () => import('./features/transactions/transactions').then((m) => m.Transactions),
  },
  {
    path: 'orcamento',
    canMatch: [authGuard],
    loadComponent: () => import('./features/budget/budget').then((m) => m.Budget),
  },
  {
    path: 'relatorios',
    canMatch: [authGuard],
    loadComponent: () => import('./features/reports/reports').then((m) => m.Reports),
  },
  {
    path: 'metas',
    canMatch: [authGuard],
    loadComponent: () => import('./features/goals/goals').then((m) => m.Goals),
  },
  {
    path: 'configuracoes',
    canMatch: [authGuard],
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
  },
  {
    path: 'notificacoes',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/notifications/notifications').then((m) => m.Notifications),
  },
  {
    path: '**',
    redirectTo: 'onboarding',
  },
];
