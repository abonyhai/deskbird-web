import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingComponent } from './listing.component';
import { Store } from '@ngrx/store';
import { AuthService } from '../../auth/services/auth.service';
import { Actions } from '@ngrx/effects';
import { ChangeDetectorRef } from '@angular/core';
import { of, Subject } from 'rxjs';
import * as UsersActions from '../../store/users/users.actions';
import * as UsersSelectors from '../../store/users/users.selectors';
import { UserRoles } from '../../shared/enums/user.enum';

class MockStore {
  select = jasmine.createSpy().and.callFake((selector) => {
    if (selector === UsersSelectors.selectUsers) return of([]);
    if (selector === UsersSelectors.selectUsersLoading) return of(false);
    if (selector === UsersSelectors.selectUsersError) return of(null);
    return of();
  });
  dispatch = jasmine.createSpy();
}
class MockAuthService {
  currentUser$ = of({ id: '1', role: UserRoles.Admin });
}
class MockActions extends Subject<any> {}
class MockChangeDetectorRef { detectChanges = jasmine.createSpy(); }

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;
  let store: Store;
  let actions$: MockActions;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingComponent],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Actions, useClass: MockActions },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.loadUsers());
  });

  it('should open edit dialog and set selectedUser on onEditUser', () => {
    const user = { id: 1, email: 'a', fullName: 'b', role: UserRoles.Admin };
    component.onEditUser(user);
    expect(component.displayEditDialog).toBeTrue();
    expect(component.selectedUser).toEqual(user);
  });

  it('should close dialog and clear selectedUser on onDialogHide', () => {
    component.selectedUser = { id: 1, email: 'a', fullName: 'b', role: UserRoles.Admin };
    component.displayEditDialog = true;
    component.onDialogHide();
    expect(component.displayEditDialog).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });

  it('should close dialog and clear selectedUser on updateUserSuccess action', () => {
    component.displayEditDialog = true;
    component.selectedUser = { id: 1, email: 'a', fullName: 'b', role: UserRoles.Admin };
    actions$.next(UsersActions.updateUserSuccess({ user: { id: 1, email: 'a', fullName: 'b', role: UserRoles.Admin } }));
    expect(component.displayEditDialog).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });
});
