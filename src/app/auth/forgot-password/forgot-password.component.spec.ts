import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
        TranslocoModule,
        TranslocoTestingModule,
        AuthLayoutComponent,
        FloatLabelModule,
        CommonModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.forgotPasswordForm.valid).toBe(false);
  });

  it('should get emailField', () => {
    expect(component.emailField).toBeTruthy();
  });

  it('should call onSubmit without error', () => {
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    component.onSubmit();
    expect(component.isLoading).toBe(false);
  });
});
