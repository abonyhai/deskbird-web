import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../shared/models/user.models';
import { CommonModule } from '@angular/common';
import { UserRoles } from '../../shared/enums/user.enum';
import { AuthService } from '../../auth/services/auth.service';
import { EditUserComponent } from '../edit-user/edit-user.component';

export type UserWithRole = User & { role?: string };

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    FormsModule,
    TagModule,
    SelectModule,
    DialogModule,
    EditUserComponent
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingComponent {
  public userRoles = UserRoles;
  public currentUser$;
  public displayEditDialog = false;
  public selectedUser: UserWithRole | null = null;

  users: UserWithRole[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatar: '',
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-02T12:00:00Z',
      role: 'admin',
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: '',
      createdAt: '2024-01-03T12:00:00Z',
      updatedAt: '2024-01-04T12:00:00Z',
      role: 'user',
    },
  ];

  constructor(private readonly authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  onEditUser(user: UserWithRole): void {
    this.selectedUser = user;
    this.displayEditDialog = true;
  }

  onDialogHide(): void {
    this.displayEditDialog = false;
    this.selectedUser = null;
  }
}
