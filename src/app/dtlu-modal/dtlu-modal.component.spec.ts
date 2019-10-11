import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DTLUModalComponent } from './dtlu-modal.component';

describe('DTLUModalComponent', () => {
  let component: DTLUModalComponent;
  let fixture: ComponentFixture<DTLUModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DTLUModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DTLUModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
