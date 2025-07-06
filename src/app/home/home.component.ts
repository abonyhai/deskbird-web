import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TranslocoModule } from '@ngneat/transloco';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, TranslocoModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readonly environment = environment;
}
