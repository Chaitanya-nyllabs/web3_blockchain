import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-request-transfer-modal',
  templateUrl: './request-transfer-modal.component.html',
  styleUrls: ['./request-transfer-modal.component.css']
})
export class RequestTransferModalComponent implements OnInit {
  @Input() user: any;
  @Output() onRequestTransfer = new EventEmitter();
  @ViewChild('closeBtn') closeBtn: ElementRef;
  sendingAmount: number;
  fromValue: number;
  toValue: number;
  requestCalled = false;

  constructor() { }

  ngOnInit() {
  }

  requestTransfer() {
    if (!this.requestCalled) {
      console.log('called1111');
      this.onRequestTransfer.emit({
        sendingAmount: this.sendingAmount,
        fromValue: this.fromValue,
        toValue: this.toValue
      });
      this.toValue = null;
      this.fromValue = null;
      this.sendingAmount = null;
      this.requestCalled = true;
      this.closeBtn.nativeElement.click();
    }
  }

}
