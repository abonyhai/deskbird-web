import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
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
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RegisterRequest } from '../models/register-request.model';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

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
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit, OnDestroy {
  public signupForm!: FormGroup;
  public isLoading$: Observable<boolean>;
  public error$: Observable<string | null>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) {
    this.isLoading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  public ngOnInit(): void {
    this.initForm();
    this.setupErrorHandling();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    if (this.signupForm.valid) {
      const signupData: RegisterRequest = this.signupForm.value;
      this.store.dispatch(AuthActions.register({ userData: signupData }));
    } else {
      this.markFormGroupTouched();
    }
  }

  private setupErrorHandling(): void {
    this.error$.pipe(takeUntil(this.destroy$)).subscribe((error: string | null) => {
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      }
    });
  }

  private initForm(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key: string): void => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
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
