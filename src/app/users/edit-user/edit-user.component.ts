import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserRoles } from '../../shared/enums/user.enum';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { updateUser } from '../../store/users/users.actions';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '../../auth/services/auth.service';
import { deleteUser } from '../../store/users/users.actions';
import { Observable } from 'rxjs';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    TranslocoModule,
    DialogModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnChanges {
  @Input() public user!: User;
  public form!: FormGroup;
  public userRoles = Object.values(UserRoles);
  public roleOptions = [
    { label: 'Admin', value: UserRoles.Admin },
    { label: 'User', value: UserRoles.User },
  ];
  public currentUser$: Observable<User | null>;
  public showDeleteConfirm = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form = this.fb.group({
        email: [this.user.email],
        fullName: [this.user.fullName],
        role: [this.user.role || UserRoles.User],
      });
    }
  }

  public onSave(): void {
    if (this.form.valid) {
      const dto = this.form.value;
      this.store.dispatch(updateUser({ id: this.user.id, dto }));
    }
  }

  public onDelete(): void {
    this.showDeleteConfirm = true;
  }

  public confirmDelete(): void {
    this.showDeleteConfirm = false;
    this.store.dispatch(deleteUser({ id: this.user.id }));
  }

  public cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  public isAdmin(user: User | null): boolean {
    return !!user && user.role === UserRoles.Admin;
  }
}
