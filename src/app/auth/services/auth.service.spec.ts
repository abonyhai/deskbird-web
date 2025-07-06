import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

class MockApiService {
  post = jasmine.createSpy();
}
class MockRouter {
  navigate = jasmine.createSpy();
}

describe('AuthService', () => {
  let service: AuthService;
  let apiService: MockApiService;
  let router: MockRouter;

  beforeEach(() => {
    apiService = new MockApiService();
    router = new MockRouter();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiService },
        { provide: Router, useValue: router },
      ],
    });
    service = TestBed.inject(AuthService);
    spyOn(window.localStorage, 'setItem').and.callFake(() => {});
    spyOn(window.localStorage, 'getItem').and.callFake((k) => {
      if (k === 'auth_token') return 'token';
      if (k === 'refreshToken') return 'refresh';
      if (k === 'user') return JSON.stringify({ id: 1, email: 'a', fullName: 'b', role: 'Admin' });
      return null;
    });
    spyOn(window.localStorage, 'removeItem').and.callFake(() => {});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set auth data', (done) => {
    apiService.post.and.returnValue(of({ success: true, data: { user: { id: 1, email: 'a', fullName: 'b', role: 'Admin' }, token: 'token', refreshToken: 'refresh' } }));
    service.login({ email: 'a', password: 'b' }).subscribe((res) => {
      expect(apiService.post).toHaveBeenCalled();
      expect(res.success).toBeTrue();
      done();
    });
  });

  it('should register and set auth data', (done) => {
    apiService.post.and.returnValue(of({ success: true, data: { user: { id: 1, email: 'a', fullName: 'b', role: 'Admin' }, token: 'token', refreshToken: 'refresh' } }));
    service.register({ email: 'a', password: 'b', firstName: 'A', lastName: 'B' }).subscribe((res) => {
      expect(apiService.post).toHaveBeenCalled();
      expect(res.success).toBeTrue();
      done();
    });
  });

  it('should logout and clear localStorage', () => {
    service.logout();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should get current user', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should check isAuthenticated', () => {
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should get token', () => {
    expect(service.getToken()).toBe('token');
  });

  it('should refresh token', (done) => {
    apiService.post.and.returnValue(of({ success: true, data: { user: { id: 1, email: 'a', fullName: 'b', role: 'Admin' }, token: 'token', refreshToken: 'refresh' } }));
    service.refreshToken().subscribe((res) => {
      expect(apiService.post).toHaveBeenCalled();
      expect(res.success).toBeTrue();
      done();
    });
  });

  it('should throw error if no refresh token', () => {
    (window.localStorage.getItem as jasmine.Spy).and.callFake(() => null);
    expect(() => service.refreshToken()).toThrow();
  });
});
