import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataTreeTable} from "../../intermediary-entities/data-tree-table";
import {HeaderColumn} from "../../intermediary-entities/header-column";
import {Actor} from "../../entities/actor";
import {ActorHttpService} from "../../services/actor-http.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicIconField} from "../../intermediary-entities/dynamic-icon-field";
import {DynamicDialogField} from "../../intermediary-entities/dynamic-dialog-field";
import {DynamicDialogConfirm} from "../../intermediary-entities/dynamic-dialog-confirm";
import {Movie} from "../../entities/movie";
import {UsefulHelper} from "../../helpers/useful-helper";

@Component({
  selector: 'app-to-do-actor',
  templateUrl: './to-do-actor.component.html',
  styleUrl: './to-do-actor.component.css'
})
export class ToDoActorComponent implements OnInit, AfterViewInit {

  protected actors!: Actor[]
  protected actorIncludeMovies!: Actor
  protected actorsId!: string []
  private actorEvent!: Actor


  // Table
  public headerColumns!: HeaderColumn[]
  public data!: DataTreeTable<any>[]
  public id: string = 'actor-tree-table'
  public tableTitle: string = 'Actor Table'
  public loading!: boolean
  public scrollable: boolean = true
  public paginator: boolean = true
  public rowsScope: number = 3


  // Sub Table
  public visibleSubTable: boolean = false;
  public headerColumnsSubTable!: HeaderColumn[]
  public dataSubTable!: DataTreeTable<any>[]
  public idSubTable: string = 'movie-tree-table'
  public tableTitleSubTable: string = 'Movie Table'
  public loadingSubTable!: boolean
  public scrollableSubTable: boolean = true
  public paginatorSubTable: boolean = true
  public rowsScopeSubTable: number = 3


  // Form Create
  public formGroupCreate!: FormGroup;
  public formTitleCreate: string = 'Actor Form Create';
  public dynamicIconFields!: DynamicIconField[];


  // Form Edit
  public formGroupUpdate!: FormGroup;
  public formTitleUpdate: string = 'Actor Form Update';
  public visibleFormUpdate: boolean = false;
  public draggableFormUpdate: boolean = false;
  public resizableFormUpdate: boolean = false;
  public dynamicDialogFields!: DynamicDialogField[]


  // Dialog
  public visibleConfirm: boolean = false;
  public draggableConfirm: boolean = false;
  public resizableConfirm: boolean = false;
  public dynamicDialogConfirm!: DynamicDialogConfirm
  private modeDialog!: 'DELETE' | 'SUBMIT' | 'WARN'


  constructor(private actorHttpService: ActorHttpService) {
  }


  ngAfterViewInit(): void {
    this.setupTable()
  }

  ngOnInit(): void {
    this.setDialogConfirm()
    this.setupFormGroupCreate()
    this.setupFormGroupUpdate()
    this.reloadActors()
    this.reloadActorsId()
  }


  // Dialog Confirm
  private setDialogConfirm() {
    this.visibleConfirm = false;
    this.draggableConfirm = false;
    this.resizableConfirm = false;
    this.dynamicDialogConfirm = new DynamicDialogConfirm()
  }

  protected setOkEventDialogConfirm() {
    switch (this.modeDialog) {
      case 'DELETE':
        const aid = this.actorEvent.aid
        this.actorHttpService.deleteDeleteOneByPk(aid).subscribe(res => {
          if (res) {
            this.reloadActors()
            this.reloadActorsId()
            this.setupTable()
          }
        }, (error) => {
          console.error(error)
        })
        break;
    }
    this.visibleConfirm = false
  }

  protected setCloseEventDialogConfirm() {
    this.visibleConfirm = false
  }

  private getDynamicDialogConfirm(mode: 'DELETE' | 'CREATE' | 'UPDATE' | 'WARN'| 'WARN_SQL' | 'INVALID',content?:string) {
    let dynamicDialogConfirm = new DynamicDialogConfirm()
    switch (mode) {
      case 'DELETE':
        dynamicDialogConfirm.setDialogConfirm(
          'pi pi-info-circle',
          {
            'color': '#d8a704',
            'font-size': '1.3rem'
          },
          'confirm',
          'Confirm Delete',
          'Are you sure to delete?'
        )
        break;
      case 'WARN':
        dynamicDialogConfirm.setDialogConfirm(
          'pi pi-exclamation-triangle',
          {
            'color': '#d8a704',
            'font-size': '1.3rem'
          },
          'warn',
          'Duplicate AID',
          'Please generate another primary key'
        )
        break;
        case 'WARN_SQL':
        dynamicDialogConfirm.setDialogConfirm(
          'pi pi-exclamation-triangle',
          {
            'color': '#d8a704',
            'font-size': '1.3rem'
          },
          'warn',
          'Duplicate AID',
          content!
        )
        break;
      case 'INVALID':
        dynamicDialogConfirm.setDialogConfirm(
          'pi pi-exclamation-triangle',
          {
            'color': '#d8a704',
            'font-size': '1.3rem'
          },
          'warn',
          'Invalid Form',
          'There are empty inputs'
        )
        break;
    }
    // open dialog
    this.visibleConfirm = true
    return dynamicDialogConfirm
  }


  // Table
  private setupTable() {
    setTimeout(() => { // have to delay for waiting actors
      this.loading = false
      let actorsFormat: { data: Actor, subData: Actor [] | null } [] = []
      this.actors.forEach(actor => (actorsFormat.push({data: actor, subData: null})))
      this.data = UsefulHelper.convertModelToDataTreeTable(actorsFormat)
      this.headerColumns = UsefulHelper.convertObjectToHeaderColumns(this.data[0].data, ["movies"])
    }, 500)
  }

  protected setInitialData($event: DataTreeTable<any>[]) {
    this.data = $event;
  }

  protected setEditEventTreeTable($event: Actor) {
    this.formGroupUpdate.patchValue({
      aid: $event.aid,
      fullName: $event.fullName,
      born: $event.born,
      contact: $event.contact
    })
    this.visibleFormUpdate = true
  }

  protected setRemoveEventTreeTable($event: Actor) {
    this.modeDialog = 'DELETE'
    this.actorEvent = $event
    this.dynamicDialogConfirm = this.getDynamicDialogConfirm(this.modeDialog) // set alert
  }

  protected setOptionalEventTreeTable($event: Actor) {
    this.actorEvent = $event
    this.tableTitleSubTable = 'Movie Table Of Actor ' + this.actorEvent.aid
    this.reloadActorIncludeMovies(this.actorEvent.aid)
    this.setupTableSubTable()
  }


  // Sub Table
  private setupTableSubTable() {
    setTimeout(() => {
      this.loadingSubTable = false
      let moviesFormat: { data: Movie, subData: Movie [] | null }[] = []
      this.actorIncludeMovies.movies.forEach(movie => (moviesFormat.push({data: movie, subData: null})))
      this.dataSubTable = UsefulHelper.convertModelToDataTreeTable(moviesFormat)
      this.actorIncludeMovies.movies[0] !== undefined // if true
        ? this.headerColumnsSubTable = UsefulHelper.convertObjectToHeaderColumns(this.actorIncludeMovies.movies[0], ["actors", "action"]) // do
        : UsefulHelper.convertObjectToHeaderColumns({
          mid: null,
          title: null,
          categories: null,
          rate: null,
          year: null
        }, ["action"]) // else
    }, 500)
  }

  protected setInitialDataSubTable($event: DataTreeTable<any>[]) {
    this.dataSubTable = $event;
  }


  // Form Update
  private setupFormGroupUpdate() {
    this.formGroupUpdate = new FormGroup({})
    this.dynamicDialogFields = [
      new DynamicDialogField('AID', 'aid', 'e-aid', new FormControl(null, Validators.required), null, 'alpha', undefined, true),
      new DynamicDialogField('FULL NAME', 'fullName', 'e-fullName', new FormControl(null, Validators.required), 'Mr. Alex Ryder', null),
      new DynamicDialogField('BORN', 'born', 'e-born', new FormControl(null, Validators.required), null, null, 'date'),
      new DynamicDialogField('CONTACT', 'contact', 'e-contact', new FormControl(null, [Validators.maxLength(10), Validators.required]), '0898388283', 'num'),
    ]
  }

  protected setInitialFormGroupUpdate($event: FormGroup) {
    this.formGroupUpdate = $event
  }

  protected setSubmitEventFormGroupUpdate() {
    if (this.formGroupUpdate.valid) {
      const values = this.formGroupUpdate.value
      const actor = new Actor()
      actor.aid = values['aid']
      actor.fullName = values['fullName']
      actor.born = values['born']
      actor.contact = values['contact']
      this.actorHttpService.putEditOne(actor).subscribe(res => {
        if (res) {
          this.reloadActors()
          this.setupTable()
        }
      }, (errorResponse) => { // case invalid field
        this.dynamicDialogConfirm = this.getDynamicDialogConfirm('WARN_SQL',errorResponse['error']['message'])
      })
    } else {
      this.dynamicDialogConfirm = this.getDynamicDialogConfirm('INVALID')
    }
  }

  protected setClearEventFormGroupUpdate() {
    // Reset only firstName and born & contact
    this.formGroupUpdate.patchValue({
      fullName: null,
      born: null,
      contact: null
    })
  }

  protected setCloseEventFormGroupUpdate() {
    this.visibleFormUpdate = false
  }


  // Form Create
  private setupFormGroupCreate() {
    this.formGroupCreate = new FormGroup({})
    this.dynamicIconFields = [
      new DynamicIconField('AID', 'aid', new FormControl(null, [Validators.maxLength(4), Validators.required]), 'aid', false).setInputText(true).setPKeyFilter(null).setPlaceholder('A001'),
      new DynamicIconField('FULL NAME', 'fullName', new FormControl(null, Validators.required), 'fullName', false).setInputText(true).setPKeyFilter(null).setPlaceholder('Mr. Alex Ryder'),
      new DynamicIconField('BORN', 'born', new FormControl(null, Validators.required), 'born', false).setInputDate(true).setPKeyFilter(null),
      new DynamicIconField('CONTACT', 'contact', new FormControl(null, [Validators.maxLength(10), Validators.required]), 'contact', false).setInputText(true).setPKeyFilter('num').setPlaceholder('0898388283'),
    ]
  }

  protected setInitialFormGroupCreate($event: FormGroup) {
    this.formGroupCreate = $event
  }

  protected setSubmitEventFormGroupCreate() {
    if (this.formGroupCreate.valid) {
      const values = this.formGroupCreate.value
      if (this.actorsId.indexOf(values['aid']) === -1) { // check duplicate aid
        const actor = new Actor()
        actor.aid = values['aid']
        actor.fullName = values['fullName']
        actor.born = values['born']
        actor.contact = values['contact']
        this.actorHttpService.postSaveOne(actor).subscribe((res) => {
          if (res) {
            this.reloadActors()
            this.reloadActorsId()
            this.setupTable()
          }
        }, (errorResponse) => { // case invalid field
          this.dynamicDialogConfirm = this.getDynamicDialogConfirm('WARN_SQL',errorResponse['error']['message'])
        })
      } else {
        this.dynamicDialogConfirm = this.getDynamicDialogConfirm('WARN')
      }
    } else {
      this.dynamicDialogConfirm = this.getDynamicDialogConfirm('INVALID')
    }
  }

  protected setClearEventFormGroupCreate() {
    this.formGroupCreate.reset()
  }


  // Reqs
  private reloadActors() {
    this.loading = true
    this.actorHttpService.getSelectAll().subscribe(data => (this.actors = data))
  }

  private reloadActorIncludeMovies(aid: string) {
    this.loadingSubTable = true
    this.visibleSubTable = true
    this.actorHttpService.getSelectOneIncludeRelationByPk(aid).subscribe(data => (this.actorIncludeMovies = data))
  }

  private reloadActorsId() {
    this.actorsId = []
    this.actorHttpService.getSelectAllAids().subscribe(data => (this.actorsId = data))
  }


}
