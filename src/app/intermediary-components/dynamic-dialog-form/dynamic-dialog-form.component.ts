import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup} from "@angular/forms";
import {DynamicDialogField} from "../../intermediary-entities/dynamic-dialog-field";

@Component({
  selector: 'dynamic-dialog-confirm-form',
  standalone: false,
  templateUrl: './dynamic-dialog-form.component.html',
  styleUrl: './dynamic-dialog-form.component.css'
})
export class DynamicDialogFormComponent implements OnInit {
  @Input()
  public formGroup! : FormGroup;
  @Input()
  public formTitle! : string;
  @Input()
  public visible!: boolean ;
  @Input()
  public draggable!: boolean ;
  @Input()
  public resizable!: boolean ;
  @Input()
  public dynamicDialogFields! :DynamicDialogField[]
  @Output()
  public submitEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public clearEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public closeEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public getFormGroup: EventEmitter<FormGroup> = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    for (let i = 0; i < this.dynamicDialogFields.length; i++) {
      this.formGroup.addControl(this.dynamicDialogFields[i].formControlName!, this.dynamicDialogFields[i].formControl)
    }
    this.getFormGroup.emit(this.formGroup);
  }

  protected getSubmitEventFormGroup() {
    this.submitEvent?.emit();
  }

  protected getClearEventFormGroup() {
    this.clearEvent?.emit();
  }

  protected getCloseEventFormGroup() {
    this.closeEvent?.emit();
  }

}
