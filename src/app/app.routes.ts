import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';
import { isUserManagerGuard } from './shared/guards/user-manager.guard';

export const routes: Routes = [
  {
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.component'),
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'user-management',
    canActivate: [isAuthenticatedGuard(), isUserManagerGuard()],
    loadComponent: () => import('./user-management/user-management.component'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
