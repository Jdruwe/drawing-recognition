import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponentComponent } from './canvas-component.component';

describe('CanvasComponentComponent', () => {
  let component: CanvasComponentComponent;
  let fixture: ComponentFixture<CanvasComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
