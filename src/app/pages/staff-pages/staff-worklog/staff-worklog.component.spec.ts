import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWorklogComponent } from './staff-worklog.component';

describe('StaffWorklogComponent', () => {
  let component: StaffWorklogComponent;
  let fixture: ComponentFixture<StaffWorklogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffWorklogComponent]
    });
    fixture = TestBed.createComponent(StaffWorklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
