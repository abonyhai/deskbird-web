import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { User } from '../../shared/models/user.models';
import { CommonModule } from '@angular/common';
import { UserRoles } from '../../shared/enums/user.enum';
import { AuthService } from '../../auth/services/auth.service';

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
    SelectModule
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingComponent {
  public userRoles = UserRoles;
  public currentUser$;
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

  public onEditUser(user: UserWithRole): void {
    // Placeholder for future popup logic
    console.log('Edit user:', user);
  }
}
