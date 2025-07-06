import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/register-request.model';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    TranslocoModule,
    CommonModule,
    RouterModule,
    AuthLayoutComponent,
    FloatLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  public isLoading = false;

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  public ngOnInit(): void {
    // Removed initForm call
  }

  public onSubmit(): void {
    console.log('onSubmit', this.signupForm.value);
    if (this.signupForm.valid) {
      this.isLoading = true;
      const { firstName, lastName, email, password } = this.signupForm.value;
      const signupData: RegisterRequest = {
        email,
        password,
        fullName: `${firstName} ${lastName}`.trim(),
      };
      this.authService.register(signupData).subscribe({
        next: (response): void => {
          this.isLoading = false;
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Registration successful! Welcome to Deskbird.',
            });
            // Navigate to home page after successful registration
            this.router.navigate(['/']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message || 'Registration failed',
            });
          }
        },
        error: (): void => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred during registration. Please try again.',
          });
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key: string): void => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  private passwordMatchValidator(formGroup: FormGroup): null | object {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  public get firstNameControl() {
    return this.signupForm.get('firstName');
  }

  public get lastNameControl() {
    return this.signupForm.get('lastName');
  }

  public get emailControl() {
    return this.signupForm.get('email');
  }

  public get passwordControl() {
    return this.signupForm.get('password');
  }

  public get confirmPasswordControl() {
    return this.signupForm.get('confirmPassword');
  }

  public get passwordMismatchError(): boolean {
    return this.signupForm.hasError('passwordMismatch') &&
           this.confirmPasswordControl?.touched === true;
  }
}
