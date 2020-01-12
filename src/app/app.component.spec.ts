import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        FlexLayoutModule
      ],
      declarations: [AppComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.debugElement.componentInstance;
      });
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'POC'`, () => {
    expect(app.name).toContain('Angular');
  });

  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Test Sortable Form Array');
  });
});
