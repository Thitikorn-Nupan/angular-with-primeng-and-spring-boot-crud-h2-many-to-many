import {KeyFilterPattern} from "primeng/keyfilter";
import {FormControl} from "@angular/forms";

export class DynamicDialogField {
  public id : string
  public label : string ;
  public formControlName? : string
  public formControl? : FormControl
  public placeholder? : string | null // can be undefined
  public pKeyFilter?: KeyFilterPattern | null | undefined // can be undefined
  public type?: string | null | undefined // can be undefined
  public readOnly?: boolean | null | undefined // can be undefined

  // undefined means you can not need to pass value on constructor
  constructor(label: string, formControlName: string,id: string , formControl: FormControl, placeholder: string | null, pKeyFilter: KeyFilterPattern | null | undefined,type?: string | null | undefined,readOnly?: boolean | null | undefined) {
    this.id = id;
    this.label = label;
    this.formControlName = formControlName;
    this.formControl = formControl;
    this.placeholder = placeholder;
    this.pKeyFilter = pKeyFilter;
    this.type = type;
    this.readOnly = readOnly;
  }
}
