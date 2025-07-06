import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TranslocoModule } from '@ngneat/transloco';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CardModule, TranslocoModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  public readonly environment = environment;
}
