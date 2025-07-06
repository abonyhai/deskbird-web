import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthLayoutComponent } from './auth-layout.component';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoTestingModule } from '@ngneat/transloco';

@Component({
  selector: 'test-host',
  template: `<app-auth-layout [title]="'Test Title'"><div class="projected">Projected Content</div></app-auth-layout>`,
  standalone: true,
  imports: [AuthLayoutComponent],
})
class TestHostComponent {}

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthLayoutComponent,
        CardModule,
        CommonModule,
        TranslocoTestingModule,
      ],
      providers: [
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title input', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
  });

  it('should project ng-content', async () => {
    const hostFixture = await TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    const compiled = hostFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.projected')?.textContent).toContain('Projected Content');
  });
});
