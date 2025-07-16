import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {DynamicIconField} from "../../intermediary-entities/dynamic-icon-field";


@Component({
  selector: 'dynamic-icon-form',
  templateUrl: './dynamic-icon-form.component.html',
  styleUrl: './dynamic-icon-form.component.css'
})
export class DynamicIconFormComponent implements OnInit {
  @Input()
  public formGroup! : FormGroup;
  @Input()
  public formTitle! : string;
  @Input()
  public dynamicIconFields! : DynamicIconField[];
  @Output()
  public submitEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public clearEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public getFormGroup: EventEmitter<FormGroup> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.dynamicIconFields.length; i++) {
      this.formGroup.addControl(this.dynamicIconFields[i].formControlName!, this.dynamicIconFields[i].formControl)
    }
    this.getFormGroup.emit(this.formGroup);
  }

  protected getSubmitEventFormGroup() {
    this.submitEvent?.emit();
  }

  protected getClearEventFormGroup() {
    this.clearEvent?.emit();
  }
}
