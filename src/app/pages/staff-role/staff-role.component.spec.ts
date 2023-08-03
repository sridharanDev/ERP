import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRoleComponent } from './staff-role.component';

describe('StaffRoleComponent', () => {
  let component: StaffRoleComponent;
  let fixture: ComponentFixture<StaffRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffRoleComponent]
    });
    fixture = TestBed.createComponent(StaffRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
