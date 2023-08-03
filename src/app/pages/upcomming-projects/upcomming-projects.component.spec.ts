import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcommingProjectsComponent } from './upcomming-projects.component';

describe('UpcommingProjectsComponent', () => {
  let component: UpcommingProjectsComponent;
  let fixture: ComponentFixture<UpcommingProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcommingProjectsComponent]
    });
    fixture = TestBed.createComponent(UpcommingProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
