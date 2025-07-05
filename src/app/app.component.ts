import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenubarModule, CardModule, RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'deskbird-web';

  get menubarItems() {
    return [
      { label: 'Home', icon: 'pi pi-home' },
      { label: 'About', icon: 'pi pi-info-circle' },
    ];
  }
}
