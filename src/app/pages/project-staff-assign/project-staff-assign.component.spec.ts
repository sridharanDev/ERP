import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStaffAssignComponent } from './project-staff-assign.component';

describe('ProjectStaffAssignComponent', () => {
  let component: ProjectStaffAssignComponent;
  let fixture: ComponentFixture<ProjectStaffAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectStaffAssignComponent]
    });
    fixture = TestBed.createComponent(ProjectStaffAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
