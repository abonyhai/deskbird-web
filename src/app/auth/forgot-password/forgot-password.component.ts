import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AuthLayoutComponent } from '../components/auth-layout/auth-layout.component';

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
    AuthLayoutComponent,
    FloatLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: [''],
    });
  }

  onSubmit(): void {
    // Handle forgot password
  }

  public get emailField() {
    return this.forgotPasswordForm.get('email');
  }
}
