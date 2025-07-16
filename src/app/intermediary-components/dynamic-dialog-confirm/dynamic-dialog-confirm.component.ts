import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DynamicDialogConfirm} from "../../intermediary-entities/dynamic-dialog-confirm";

@Component({
  selector: 'dynamic-dialog-confirm',
  standalone: false,
  templateUrl: './dynamic-dialog-confirm.component.html',
  styleUrl: './dynamic-dialog-confirm.component.css'
})
export class DynamicDialogConfirmComponent {

  @Input()
  public visible!: boolean ;
  @Input()
  public draggable!: boolean ;
  @Input()
  public resizable!: boolean ;
  @Input()
  public dynamicDialogConfirm! :DynamicDialogConfirm
  @Output()
  public okEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public closeEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  protected getOkEventDialog() {
    this.okEvent.emit()
  }

  protected getCloseEventDialog() {
    this.closeEvent.emit()
  }

}
