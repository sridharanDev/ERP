import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminRoleComponent } from './edit-admin-role.component';

describe('EditAdminRoleComponent', () => {
  let component: EditAdminRoleComponent;
  let fixture: ComponentFixture<EditAdminRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAdminRoleComponent]
    });
    fixture = TestBed.createComponent(EditAdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
