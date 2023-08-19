import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScheduleComponent } from './project-schedule.component';

describe('ProjectScheduleComponent', () => {
  let component: ProjectScheduleComponent;
  let fixture: ComponentFixture<ProjectScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectScheduleComponent]
    });
    fixture = TestBed.createComponent(ProjectScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
