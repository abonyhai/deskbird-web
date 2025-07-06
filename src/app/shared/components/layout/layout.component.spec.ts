import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UserProfileBadgeComponent } from '../user-profile-badge/user-profile-badge.component';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

class MockTranslocoService {
  translate = (key: string) => key;
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { url: '/users' };
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        RouterTestingModule,
        TranslocoModule,
        UserProfileBadgeComponent,
        MenubarModule,
        PopoverModule,
        CommonModule,
      ],
      providers: [
        { provide: TranslocoService, useClass: MockTranslocoService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return menubarItems with translated label', () => {
    expect(component.menubarItems.length).toBeGreaterThan(0);
    expect(component.menubarItems[0]?.label).toBe('LAYOUT.MENU.USERS');
  });

  it('should return true for isActive if url matches', () => {
    expect(component['router']).toBeDefined();
    expect(component.isActive('/users')).toBeTrue();
  });
});
