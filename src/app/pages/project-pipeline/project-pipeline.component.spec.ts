import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPipelineComponent } from './project-pipeline.component';

describe('ProjectPipelineComponent', () => {
  let component: ProjectPipelineComponent;
  let fixture: ComponentFixture<ProjectPipelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectPipelineComponent]
    });
    fixture = TestBed.createComponent(ProjectPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
