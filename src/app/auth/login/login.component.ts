import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/login-request.model';
import { ApiResponse } from '../../shared/models/common.models';
import { AuthResponse } from '../models/auth.models';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    TranslocoModule,
    AuthLayoutComponent,
    FloatLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    this.markFormGroupTouched();
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const loginRequest: LoginRequest = this.loginForm.value;
    this.authService.login(loginRequest).subscribe({
      next: (response: ApiResponse<AuthResponse>) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.router.navigate(['/']);
        } else {
          this.handleLoginError(response.message || 'Login failed');
        }
      },
      error: (): void => {
        this.isLoading = false;
        this.handleLoginError('An error occurred during login. Please try again.');
      },
    });
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key: string): void => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private handleLoginError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: message,
    });
  }

  public get passwordControl() {
    return this.loginForm.get('password');
  }
}
