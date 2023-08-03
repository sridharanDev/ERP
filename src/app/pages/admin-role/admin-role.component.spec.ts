import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleComponent } from './admin-role.component';

describe('AdminRoleComponent', () => {
  let component: AdminRoleComponent;
  let fixture: ComponentFixture<AdminRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRoleComponent]
    });
    fixture = TestBed.createComponent(AdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
