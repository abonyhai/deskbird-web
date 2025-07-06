import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { TranslocoTestingModule } from '@ngneat/transloco';

class MockAuthService {
  register = () => of();
}
class MockRouter {
  navigate = () => {};
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, ReactiveFormsModule, TranslocoTestingModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        MessageService,
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SignupComponent);
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
    expect(component.signupForm.valid).toBe(false);
  });

  it('should validate required fields and min length', () => {
    component.signupForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    expect(component.signupForm.valid).toBe(false);
    component.signupForm.setValue({
      firstName: 'A',
      lastName: 'B',
      email: 'not-an-email',
      password: '123',
      confirmPassword: '123',
    });
    expect(component.signupForm.valid).toBe(false);
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(component.signupForm.valid).toBe(true);
  });

  it('should mark form as touched if invalid on submit', () => {
    spyOn(component as any, 'markFormGroupTouched');
    component.signupForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    component.onSubmit();
    expect((component as any).markFormGroupTouched).toHaveBeenCalled();
  });

  it('should call AuthService.register and navigate on success', () => {
    spyOn(authService, 'register').and.returnValue(
      of({ success: true, data: { user: {}, token: 'token', refreshToken: 'refresh' } }) as any
    );
    const navigateSpy = spyOn(router, 'navigate');
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    component.onSubmit();
    expect(authService.register).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should show error message on register failure', () => {
    spyOn(authService, 'register').and.returnValue(
      of({ success: false, message: 'Registration failed' }) as any
    );
    const addSpy = spyOn(messageService, 'add');
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    component.onSubmit();
    expect(authService.register).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'Registration failed' })
    );
  });

  it('should show error message on register error', () => {
    spyOn(authService, 'register').and.returnValue(
      throwError(() => new Error('Network error'))
    );
    const addSpy = spyOn(messageService, 'add');
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    component.onSubmit();
    expect(authService.register).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'An error occurred during registration. Please try again.' })
    );
  });

  it('should set passwordMismatchError if passwords do not match', () => {
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '654321',
    });
    expect(component.passwordMismatchError).toBe(true);
  });
});
