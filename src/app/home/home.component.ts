import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TranslocoModule } from '@ngneat/transloco';
import { TestApiService } from '../shared/services/test-api.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, TranslocoModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public apiStatus: string = 'Testing...';
  public readonly environment = environment;

  constructor(private readonly testApiService: TestApiService) {}

  public ngOnInit(): void {
    this.testApiConnection();
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
