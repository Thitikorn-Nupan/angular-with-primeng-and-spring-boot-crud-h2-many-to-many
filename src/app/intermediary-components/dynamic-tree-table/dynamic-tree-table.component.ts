import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataTreeTable} from "../../intermediary-entities/data-tree-table";
import {HeaderColumn} from "../../intermediary-entities/header-column";


@Component({
  selector: 'dynamic-tree-table',
  templateUrl: './dynamic-tree-table.component.html',
  styleUrl: './dynamic-tree-table.component.css'
})
export class DynamicTreeTableComponent {
  @Input()
  public data!: DataTreeTable<any>[] // data for map api to p tree table
  @Input()
  public tableTitle!: string;
  // @Input()
  // public models!: { data: any, subData: any[] | null } []
  @Input()
  public headerColumns!: HeaderColumn[]
  @Input()
  public id!: string
  @Input()
  public scrollable!: boolean
  @Input()
  public loading!: boolean
  @Input()
  public optionalAction: boolean = false
  @Input()
  public defaultOptionalAction: boolean = true
  @Input()
  public disableMode : boolean = false
  @Input()
  public paginator!: boolean
  @Input()
  public rowsScope!: number
  @Output()
  public editEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public removeEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public optionalEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  public getData: EventEmitter<DataTreeTable<any>[]> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.getData.emit(this.data)
  }

  public reloadData(data:DataTreeTable<any>[]): void {
    this.data = data
    console.log(this.data)
  }

  protected getEditEventTreeTable(data: any) {
    this.editEvent.emit(data)
  }

  protected getRemoveEventTreeTable(data: any) {
    this.removeEvent.emit(data)
  }

  protected getOptionalEventTreeTable(data: any) {
    this.optionalEvent.emit(data)
  }
}
