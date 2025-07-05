import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private readonly apiService: ApiService) {}

  /**
   * Test the API connection
   */
  public testConnection(): Observable<ApiResponse> {
    return this.apiService.get('/health');
  }

  /**
   * Get API version info
   */
  public getApiInfo(): Observable<ApiResponse> {
    return this.apiService.get('/');
  }

  /**
   * Test authentication endpoint
   */
  public testAuth(): Observable<ApiResponse> {
    return this.apiService.get('/auth/me');
  }
}
