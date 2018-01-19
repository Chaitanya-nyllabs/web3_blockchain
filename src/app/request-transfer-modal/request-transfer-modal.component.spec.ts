import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTransferModalComponent } from './request-transfer-modal.component';

describe('RequestTransferModalComponent', () => {
  let component: RequestTransferModalComponent;
  let fixture: ComponentFixture<RequestTransferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestTransferModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
