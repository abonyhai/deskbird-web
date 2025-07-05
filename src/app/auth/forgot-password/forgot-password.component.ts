import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
    TranslocoModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  public forgotPasswordForm: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.isSubmitted = true;

      // TODO: Implement forgot password logic
      console.log('Forgot password form submitted:', this.forgotPasswordForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }

  public get emailField() {
    return this.forgotPasswordForm.get('email');
  }
}
