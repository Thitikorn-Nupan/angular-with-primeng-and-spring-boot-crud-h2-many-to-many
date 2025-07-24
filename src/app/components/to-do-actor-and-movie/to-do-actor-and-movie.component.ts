import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HeaderColumn} from "../../intermediary-entities/header-column";
import {DataTreeTable} from "../../intermediary-entities/data-tree-table";
import {Actor} from "../../entities/actor";
import {UsefulHelper} from "../../helpers/useful-helper";
import {ActorHttpService} from "../../services/actor-http.service";
import {MovieHttpService} from "../../services/movie-http.service";
import {Movie} from "../../entities/movie";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicIconField} from "../../intermediary-entities/dynamic-icon-field";
import {DynamicDialogConfirm} from "../../intermediary-entities/dynamic-dialog-confirm";
import {ActorMovieHttpService} from "../../services/actor-movie-http.service";
import {ActorMovie} from "../../entities/actor-movie";

@Component({
  selector: 'app-to-do-actor-and-movie',
  templateUrl: './to-do-actor-and-movie.component.html',
  styleUrl: './to-do-actor-and-movie.component.css'
})
export class ToDoActorAndMovieComponent implements OnInit ,AfterViewInit {

  protected actors!: Actor[]
  protected actorEvent!: Actor
  protected movies!: Movie[]


  // Table actor
  public headerColumns!: HeaderColumn[]
  public data!: DataTreeTable<any>[]
  public id: string = 'actor-tree-table'
  public tableTitle: string = 'Actor Table (See all movies that actor is not in, click action)'
  public loading!: boolean
  public scrollable: boolean = true
  public paginator: boolean = true
  public rowsScope: number = 5

  // Sub Table
  public visibleSubTable: boolean = false;
  public headerColumnsSubTable!: HeaderColumn[]
  public dataSubTable!: DataTreeTable<any>[]
  public idSubTable: string = 'movie-tree-table'
  public tableTitleSubTable: string = 'Movie Table'
  public loadingSubTable!: boolean
  public scrollableSubTable: boolean = true
  public paginatorSubTable: boolean = true
  public rowsScopeSubTable: number = 5


  // Form Create
  public formGroupCreate!: FormGroup;
  public formTitleCreate: string = 'Actor & Movie Form Create';
  public dynamicIconFields!: DynamicIconField[];


  // Dialog
  public visibleConfirm: boolean = false;
  public draggableConfirm: boolean = false;
  public resizableConfirm: boolean = false;
  public dynamicDialogConfirm! : DynamicDialogConfirm
  private modeDialog! : 'DELETE' | 'SUBMIT'| 'WARN'

  constructor(private actorHttpService: ActorHttpService,private movieHttpService: MovieHttpService,private actorMovieHttpService:ActorMovieHttpService) {}

  ngAfterViewInit(): void {
    this.setupTable()
  }

  ngOnInit(): void {
    this.setDialogConfirm()
    this.setupFormGroupCreate()
    this.reloadActors()
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
          'Duplicate MID',
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


  protected setOptionalEventTreeTable($event: Actor) {
    this.actorEvent = $event
    this.tableTitleSubTable = 'Movie Table That Actor ' + this.actorEvent.fullName + ' Not In'
    this.reloadMovies(this.actorEvent.aid)
    this.setupTableSubTable()
  }


  // Sub Table
  private setupTableSubTable() {
    setTimeout(() => {
      this.loadingSubTable = false
      let moviesFormat: { data: Movie, subData: Movie [] | null }[] = []
      this.movies.forEach(movie => (moviesFormat.push({data: movie, subData: null})))
      this.dataSubTable = UsefulHelper.convertModelToDataTreeTable(moviesFormat)
      this.headerColumnsSubTable = UsefulHelper.convertObjectToHeaderColumns(this.movies[0], ["actors", "action"])
    }, 500)
  }

  protected setInitialDataSubTable($event: DataTreeTable<any>[]) {
    this.dataSubTable = $event;
  }


  // Form Create
  private setupFormGroupCreate() {
    this.formGroupCreate = new FormGroup({})
    this.dynamicIconFields = [
      new DynamicIconField('AID', 'aid', new FormControl(null, [Validators.maxLength(4), Validators.required]), 'aid', false).setInputText(true).setPKeyFilter(null).setPlaceholder('A001'),
      new DynamicIconField('MID', 'mid', new FormControl(null, [Validators.maxLength(4), Validators.required]), 'mid', false).setInputText(true).setPKeyFilter(null).setPlaceholder('M001')
    ]
  }

  protected setInitialFormGroupCreate($event: FormGroup) {
    this.formGroupCreate = $event
  }

  protected setSubmitEventFormGroupCreate() {
    if (this.formGroupCreate.valid) {
      const values = this.formGroupCreate.value
      const aid = values['aid']
      const mid = values['mid']
      this.movieHttpService.getSelectOnlyMidsAllNotInAid(aid).subscribe(res => {
        if (res.indexOf(mid) !== -1) { // -1 is not found
          const actorMovie = new ActorMovie()
          actorMovie.mid = mid
          actorMovie.aid = aid
          this.actorMovieHttpService.postSaveOne(actorMovie).subscribe(res => {
            if (res) {
              this.formGroupCreate.reset()
            }
          }, (errorResponse) => { // case invalid field
            this.dynamicDialogConfirm = this.getDynamicDialogConfirm('WARN_SQL',errorResponse['error']['message'])
          })
        } else {
          this.dynamicDialogConfirm = this.getDynamicDialogConfirm('WARN')
        }
      })
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

  private reloadMovies(aid: string) {
    this.loadingSubTable = true
    this.visibleSubTable = true
    this.movieHttpService.getSelectAllNotInAid(aid).subscribe(data => (this.movies = data))
  }


}
