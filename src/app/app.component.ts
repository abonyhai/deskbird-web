import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TestApiService } from './shared/services/test-api.service';
import { environment } from './environments/environment';

interface MenuItem {
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenubarModule, CardModule, RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public readonly title: string = 'deskbird-web';
  public apiStatus: string = 'Testing...';
  public readonly environment = environment;

  constructor(private readonly testApiService: TestApiService) {}

  public ngOnInit(): void {
    this.testApiConnection();
  }

  public get menubarItems(): MenuItem[] {
    return [
      { label: 'Home', icon: 'pi pi-home' },
      { label: 'About', icon: 'pi pi-info-circle' },
    ];
  }

  private testApiConnection(): void {
    this.testApiService.testConnection().subscribe({
      next: (response: { success: boolean }): void => {
        this.apiStatus = response.success ? 'Connected' : 'Error';
        if (environment.enableDebug) {
          console.log('API Test Response:', response);
        }
      },
      error: (error: unknown): void => {
        this.apiStatus = 'Failed';
        console.error('API Test Error:', error);
      }
    });
  }
}
