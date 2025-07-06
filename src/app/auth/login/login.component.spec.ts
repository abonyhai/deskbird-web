import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { TranslocoTestingModule } from '@ngneat/transloco';

class MockAuthService {
  login = () => of();
}
class MockRouter {
  navigate = () => {};
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, TranslocoTestingModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        MessageService,
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should validate email and password fields', () => {
    const email = component.loginForm.get('email');
    const password = component.loginForm.get('password');
    email?.setValue('not-an-email');
    password?.setValue('123');
    expect(email?.valid).toBe(false);
    expect(password?.valid).toBe(false);
    email?.setValue('test@example.com');
    password?.setValue('123456');
    expect(email?.valid).toBe(true);
    expect(password?.valid).toBe(true);
  });

  it('should call AuthService.login and navigate on success', () => {
    spyOn(authService, 'login').and.returnValue(
      of({ success: true, data: { user: {}, token: 'token', refreshToken: 'refresh' } }) as any
    );
    const navigateSpy = spyOn(router, 'navigate');
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on login failure', () => {
    spyOn(authService, 'login').and.returnValue(
      of({ success: false, message: 'Invalid credentials' }) as any
    );
    const addSpy = spyOn(messageService, 'add');
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'Invalid credentials' })
    );
  });

  it('should show error message on login error', () => {
    spyOn(authService, 'login').and.returnValue(
      throwError(() => new Error('Network error'))
    );
    const addSpy = spyOn(messageService, 'add');
    component.loginForm.setValue({ email: 'test@example.com', password: '123456' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'An error occurred during login. Please try again.' })
    );
  });

  it('should not submit if form is invalid', () => {
    const loginSpy = spyOn(authService, 'login');
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(loginSpy).not.toHaveBeenCalled();
  });
});
