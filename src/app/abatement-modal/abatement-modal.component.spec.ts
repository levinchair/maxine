import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbatementModalComponent } from './abatement-modal.component';

describe('AbatementModalComponent', () => {
  let component: AbatementModalComponent;
  let fixture: ComponentFixture<AbatementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbatementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbatementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
