import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';

interface MenuItem {
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MenubarModule, RouterOutlet, TranslocoModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  public readonly title: string = 'deskbird-web';

  public get menubarItems(): MenuItem[] {
    return [
      { label: 'Home', icon: 'pi pi-home' },
      { label: 'About', icon: 'pi pi-info-circle' },
    ];
  }
}
