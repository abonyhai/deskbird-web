import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { UserProfileBadgeComponent } from '../user-profile-badge/user-profile-badge.component';

interface MenuItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenubarModule, PopoverModule, RouterOutlet, RouterModule, TranslocoModule, CommonModule, UserProfileBadgeComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  public readonly title: string = 'deskbird-web';

  constructor(private readonly router: Router, private readonly translocoService: TranslocoService) {}

  public get menubarItems(): MenuItem[] {
    return [
      { label: this.translocoService ? this.translocoService.translate('LAYOUT.MENU.USERS'): 'Users', icon: 'pi pi-users', route: '/users' },
    ];
  }

  public isActive(link: string): boolean {
    return this.router.url === link;
  }
}
