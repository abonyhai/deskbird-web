import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileBadgeComponent } from './user-profile-badge.component';
import { AvatarModule } from 'primeng/avatar';
import { PopoverModule } from 'primeng/popover';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../../auth/services/auth.service';
import { TranslocoTestingModule } from '@ngneat/transloco';

class MockAuthService {
  logout = jasmine.createSpy();
}

describe('UserProfileBadgeComponent', () => {
  let component: UserProfileBadgeComponent;
  let fixture: ComponentFixture<UserProfileBadgeComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserProfileBadgeComponent,
        AvatarModule,
        PopoverModule,
        DividerModule,
        ButtonModule,
        TranslocoModule,
        TranslocoTestingModule,
        CommonModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UserProfileBadgeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render fullName input', () => {
    component.fullName = 'Test User';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
  });

  it('should call logout on button click', () => {
    spyOn(component, 'onLogout').and.callThrough();
    const button = fixture.debugElement.query(By.css('p-button'));
    button.triggerEventHandler('click', {});
    expect(component.onLogout).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
  });
});
