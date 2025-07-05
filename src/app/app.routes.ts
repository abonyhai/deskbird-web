import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Auth routes (public - no guard)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },

  // Protected routes (require authentication)
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
      },
      // Add more child routes here for other application features
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      // },
      // {
      //   path: 'profile',
      //   loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
      // },
    ],
  },

  // Fallback route
  {
    path: '**',
    redirectTo: 'login',
  },
];
