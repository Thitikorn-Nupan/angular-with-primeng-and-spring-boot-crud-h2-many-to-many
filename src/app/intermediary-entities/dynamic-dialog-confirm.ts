export class DynamicDialogConfirm {

  public icon! : string
  public iconStyle! : any
  public key! : 'confirm' | 'warn' | 'error';
  public titleDialog! : string
  public content! : string

  /*constructor(icon: string, iconColor: any, key: 'confirm' | 'warn' | 'error', titleDialog: string, content: string) {
    this.icon = icon;
    this.iconStyle = iconColor;
    this.key = key;
    this.titleDialog = titleDialog;
    this.content = content;
  }*/

  public setDialogConfirm(icon: string, iconColor: any, key: 'confirm' | 'warn' | 'error', titleDialog: string, content: string) {
    this.icon = icon;
    this.iconStyle = iconColor;
    this.key = key;
    this.titleDialog = titleDialog;
    this.content = content;
    return this
  }
}
