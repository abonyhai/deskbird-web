import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PopoverModule } from 'primeng/popover';
import { map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-profile-badge',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    PopoverModule,
    TranslocoModule,
    DividerModule,
  ],
  templateUrl: './user-profile-badge.component.html',
  styleUrls: ['./user-profile-badge.component.scss'],
})
export class UserProfileBadgeComponent {
  public fullName$ = this.authService.currentUser$.pipe(
    map(user => user?.fullName || '')
  );

  constructor(private readonly authService: AuthService) {}

  public onLogout(): void {
    this.authService.logout();
  }
}
