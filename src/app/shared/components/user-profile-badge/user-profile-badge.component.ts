import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PopoverModule } from 'primeng/popover';

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
  @Input() public fullName: string = '';

  public onLogout(): void {
    // TODO: Implement actual logout logic
    console.log('Logout clicked');
  }
}
