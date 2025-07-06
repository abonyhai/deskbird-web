import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CardModule } from 'primeng/card';
import { TranslocoModule, TranslocoTestingModule } from '@ngneat/transloco';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        RouterTestingModule,
        CardModule,
        TranslocoModule,
        TranslocoTestingModule,
      ],
      providers: [
        { provide: 'TRANSLOCO_CONFIG', useValue: { availableLangs: ['en'], defaultLang: 'en' } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
