import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLeaveComponent } from './staff-leave.component';

describe('StaffLeaveComponent', () => {
  let component: StaffLeaveComponent;
  let fixture: ComponentFixture<StaffLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffLeaveComponent]
    });
    fixture = TestBed.createComponent(StaffLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
