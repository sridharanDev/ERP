import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRootComponent } from './staff-root.component';

describe('StaffRootComponent', () => {
  let component: StaffRootComponent;
  let fixture: ComponentFixture<StaffRootComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffRootComponent]
    });
    fixture = TestBed.createComponent(StaffRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
