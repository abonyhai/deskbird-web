import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotAuthGuard } from './auth/guards/not-auth.guard';

export const routes: Routes = [
  // Auth routes (public - only for guests)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [NotAuthGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [NotAuthGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
    canActivate: [NotAuthGuard],
  },

  // Protected routes (require authentication)
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
        children: [
          { path: '', redirectTo: 'listing', pathMatch: 'full' },
          { path: 'listing', loadComponent: () => import('./users/listing/listing.component').then(m => m.ListingComponent) },
        ],
      },
      // Add more child routes here for other application features
    ],
  },

  // Fallback route
  {
    path: '**',
    redirectTo: 'login',
  },
];
