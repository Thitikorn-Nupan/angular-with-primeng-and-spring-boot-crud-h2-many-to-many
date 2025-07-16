import {FormControl} from "@angular/forms";
import {KeyFilterPattern} from "primeng/keyfilter";

// for primeng 17
export interface OptionDropdown {
  key: string,
  label: string,
  data: string,
  icon: string,
  children : OptionDropdown[]
}

interface RadioButton {
  status: boolean
  options : { name: string; key: string } []
}

interface Checkbox {
  status: boolean
  options : { name: string; key: string } []
}

export class DynamicIconField {

  public icon? : string | null
  public formControlName? : string
  public formControl? : FormControl
  public id? : string
  public placeholder? : string | null // can be undefined
  public pKeyFilter?: KeyFilterPattern | null | undefined // can be undefined
  public isInputText? : boolean | null
  public isInputDate? : boolean | null
  public isIconExist? : boolean | null
  public isTextarea? : boolean | null
  public isDropdown? : OptionDropdown[] | null // for primeng 17
  public isCheckbox? : Checkbox | null
  public isRadio? : RadioButton | null
  public isReadOnly: boolean = false


  constructor(icon: string | null,
              formControlName: string ,
              formControl : FormControl ,
              id: string,
              isIconExist: boolean | null) {
    this.icon = icon;
    this.formControlName = formControlName;
    this.formControl = formControl;
    this.id = id;
    this.isIconExist = isIconExist
    this.isInputText = null;
    this.isInputDate = null;
    this.isTextarea = null;
    this.isDropdown = null;
    this.isCheckbox = null
    this.isRadio = null
    this.placeholder = null;
    this.pKeyFilter = undefined // 'alpha' // alpha is meaning any char
  }

  public setPlaceholder(value : string) {
    this.placeholder = value;
    return this;
  }

  public setReadOnly(value : boolean) {
    this.isReadOnly = value;
    return this;
  }

  public setInputText(value : boolean) {
    this.isInputText = value;
    return this;
  }

  public setInputDate(value : boolean) {
    this.isInputDate = value;
    return this;
  }

  public setPKeyFilter(value : KeyFilterPattern | null) {
    this.pKeyFilter = value;
    return this;
  }

  public setDropdown(value: OptionDropdown[]) {
    this.isDropdown = value;
    return this;
  }

  public setCheckbox(value: Checkbox) {
    this.isCheckbox = value;
    return this;
  }

  public setRadio(value: RadioButton) {
    this.isRadio = value;
    return this;
  }

  public setTextarea(value: boolean) {
    this.isTextarea = value;
    return this;
  }

  public setFormControl(value: FormControl) {
    this.formControl = value;
    return this;
  }
}
