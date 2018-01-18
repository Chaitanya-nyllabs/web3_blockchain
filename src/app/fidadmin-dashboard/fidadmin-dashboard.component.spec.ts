import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FidadminDashboardComponent } from './fidadmin-dashboard.component';

describe('FidadminDashboardComponent', () => {
  let component: FidadminDashboardComponent;
  let fixture: ComponentFixture<FidadminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FidadminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FidadminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
