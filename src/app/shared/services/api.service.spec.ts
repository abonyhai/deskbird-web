import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

let http: jasmine.SpyObj<HttpClient>;

describe('ApiService', () => {
  let service: ApiService;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: HttpClient, useValue: http },
      ],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get with correct URL and params', () => {
    http.get.and.returnValue(of({ success: true }));
    service.get('/test', undefined).subscribe();
    expect(http.get).toHaveBeenCalledWith(baseUrl + '/test', {});
  });

  it('should call post with correct URL and body', () => {
    http.post.and.returnValue(of({ success: true }));
    service.post('/test', { foo: 'bar' }).subscribe();
    expect(http.post).toHaveBeenCalledWith(baseUrl + '/test', { foo: 'bar' });
  });

  it('should call put with correct URL and body', () => {
    http.put.and.returnValue(of({ success: true }));
    service.put('/test', { foo: 'bar' }).subscribe();
    expect(http.put).toHaveBeenCalledWith(baseUrl + '/test', { foo: 'bar' });
  });

  it('should call patch with correct URL and body', () => {
    http.patch.and.returnValue(of({ success: true }));
    service.patch('/test', { foo: 'bar' }).subscribe();
    expect(http.patch).toHaveBeenCalledWith(baseUrl + '/test', { foo: 'bar' });
  });

  it('should call delete with correct URL', () => {
    http.delete.and.returnValue(of({ success: true }));
    service.delete('/test').subscribe();
    expect(http.delete).toHaveBeenCalledWith(baseUrl + '/test');
  });

  it('should handle errors in get', () => {
    http.get.and.returnValue(throwError(() => new Error('fail')));
    service.get('/fail').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });
  });
});
