import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  public canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true;
    }
    // Redirect to home if already authenticated
    this.router.navigate(['/']);
    return false;
  }
}

export const notAuthGuard = (guard: NotAuthGuard) => guard.canActivate();
