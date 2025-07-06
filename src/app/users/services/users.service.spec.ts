import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { environment } from '../environments/environment';
import { UsersService } from './users.service';

class MockHttpClient {
  get = jasmine.createSpy();
  patch = jasmine.createSpy();
}
class MockAuthService {
  getToken = jasmine.createSpy();
}

describe('UsersService', () => {
  let service: UsersService;
  let http: MockHttpClient;
  let auth: MockAuthService;
  const baseUrl = `${environment.apiBaseUrl}/users`;

  beforeEach(() => {
    http = new MockHttpClient();
    auth = new MockAuthService();
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: HttpClient, useValue: http },
        { provide: AuthService, useValue: auth },
      ],
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw if no token on getUsers', (done) => {
    auth.getToken.and.returnValue(null);
    service.getUsers().subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should call http.get with correct URL and headers', () => {
    auth.getToken.and.returnValue('token');
    http.get.and.returnValue(of([{ id: 1, email: 'a', fullName: 'b', role: 'Admin' }]));
    service.getUsers().subscribe();
    expect(http.get).toHaveBeenCalledWith(baseUrl, jasmine.any(Object));
  });

  it('should throw if no token on updateUser', (done) => {
    auth.getToken.and.returnValue(null);
    service.updateUser(1, { email: 'a' }).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should call http.patch with correct URL, dto, and headers', () => {
    auth.getToken.and.returnValue('token');
    http.patch.and.returnValue(of({ id: 1, email: 'a', fullName: 'b', role: 'Admin' }));
    service.updateUser(1, { email: 'a' }).subscribe();
    expect(http.patch).toHaveBeenCalledWith(`${baseUrl}/1`, { email: 'a' }, jasmine.any(Object));
  });
});
