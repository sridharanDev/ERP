import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeComponent } from './expense-type.component';

describe('ExpenseTypeComponent', () => {
  let component: ExpenseTypeComponent;
  let fixture: ComponentFixture<ExpenseTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTypeComponent]
    });
    fixture = TestBed.createComponent(ExpenseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
