import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { UserProfileBadgeComponent } from '../user-profile-badge/user-profile-badge.component';

interface MenuItem {
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenubarModule, PopoverModule, RouterOutlet, TranslocoModule, CommonModule, UserProfileBadgeComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  public readonly title: string = 'deskbird-web';
  public fullName: string = 'John Doe'; // Replace with actual user full name from your auth logic

  public get menubarItems(): MenuItem[] {
    return [
      { label: 'Users', icon: 'pi pi-users' },
    ];
  }
}
