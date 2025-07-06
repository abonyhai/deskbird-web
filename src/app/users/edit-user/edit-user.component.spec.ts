import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserRoles } from '../../shared/enums/user.enum';
import * as UsersActions from '../../store/users/users.actions';
import { TranslocoTestingModule } from '@ngneat/transloco';

class MockStore {
  dispatch = jasmine.createSpy();
}

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserComponent, ReactiveFormsModule, TranslocoTestingModule],
      providers: [
        FormBuilder,
        { provide: Store, useClass: MockStore },
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form on user input change', () => {
    const user = { id: 1, email: 'a@b.com', fullName: 'Test User', role: UserRoles.Admin };
    component.user = user;
    component.ngOnChanges({ user: { currentValue: user, previousValue: null, firstChange: true, isFirstChange: () => true } });
    expect(component.form.value).toEqual({ email: 'a@b.com', fullName: 'Test User', role: UserRoles.Admin });
  });

  it('should dispatch updateUser on valid form submit', () => {
    const user = { id: 1, email: 'a@b.com', fullName: 'Test User', role: UserRoles.Admin };
    component.user = user;
    component.ngOnChanges({ user: { currentValue: user, previousValue: null, firstChange: true, isFirstChange: () => true } });
    component.form.setValue({ email: 'a@b.com', fullName: 'Test User', role: UserRoles.Admin });
    component.onSave();
    expect(store.dispatch).toHaveBeenCalledWith(UsersActions.updateUser({ id: 1, dto: { email: 'a@b.com', fullName: 'Test User', role: UserRoles.Admin } }));
  });

  it('should not dispatch updateUser if form is invalid', () => {
    const user = { id: 1, email: '', fullName: '', role: UserRoles.Admin };
    component.user = user;
    component.ngOnChanges({ user: { currentValue: user, previousValue: null, firstChange: true, isFirstChange: () => true } });
    component.form.setValue({ email: '', fullName: '', role: UserRoles.Admin });
    component.onSave();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
