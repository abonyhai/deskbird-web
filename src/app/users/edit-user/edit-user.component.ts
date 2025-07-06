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
import { updateUser } from '../../users/actions/users.actions';

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
    ButtonModule
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

  constructor(private fb: FormBuilder, private store: Store) {}

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
}
