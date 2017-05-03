import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessComponent } from './guess.component';

describe('GuessComponent', () => {
  let component: GuessComponent;
  let fixture: ComponentFixture<GuessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
