import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { UserRoles } from '../../shared/enums/user.enum';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.models';
import { EditUserComponent } from '../edit-user/edit-user.component';
import * as UsersActions from '../actions/users.actions';
import * as UsersSelectors from '../selectors/users.selectors';
import { AuthService } from '../../auth/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    EditUserComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingComponent implements OnInit {
  public userRoles = UserRoles;
  public currentUser$;
  public displayEditDialog = false;
  public selectedUser: UserWithRole | null = null;

  public users$!: Observable<User[]>;
  public loading$!: Observable<boolean>;
  public error$!: Observable<string | null>;

  public constructor(private readonly store: Store, private readonly authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.users$ = this.store.select(UsersSelectors.selectUsers);
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
    this.error$ = this.store.select(UsersSelectors.selectUsersError);
  }

  public ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  public onEditUser(user: UserWithRole): void {
    this.selectedUser = user;
    this.displayEditDialog = true;
  }

  public onDialogHide(): void {
    this.displayEditDialog = false;
    this.selectedUser = null;
  }
}
