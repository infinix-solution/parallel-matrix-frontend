import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'matrix-enterprises',
        loadComponent: () => import('./features/public/sister-page/sister-page.component').then(m => m.SisterPageComponent)
      }
    ]
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/forgot-password',
    loadComponent: () =>
      import('./features/admin/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'admin/reset-password',
    loadComponent: () =>
      import('./features/admin/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: '' }
];
