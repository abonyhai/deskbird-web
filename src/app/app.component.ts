import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule, CardModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'deskbird-web';

  get menubarItems() {
    return [
      { label: 'Home', icon: 'pi pi-home' },
      { label: 'About', icon: 'pi pi-info-circle' }
    ];
  }
}
