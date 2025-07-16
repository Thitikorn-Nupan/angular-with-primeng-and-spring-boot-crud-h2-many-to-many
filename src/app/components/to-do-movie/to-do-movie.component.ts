import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataTreeTable} from "../../intermediary-entities/data-tree-table";
import {HeaderColumn} from "../../intermediary-entities/header-column";
import {MovieHttpService} from "../../services/movie-http.service";
import {Movie} from "../../entities/movie";
import {Actor} from "../../entities/actor";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DynamicIconField} from "../../intermediary-entities/dynamic-icon-field";
import {UsefulHelper} from "../../helpers/useful-helper";
import {DynamicDialogField} from "../../intermediary-entities/dynamic-dialog-field";
import {DynamicDialogConfirm} from "../../intermediary-entities/dynamic-dialog-confirm";

@Component({
  selector: 'app-to-do-movie',
  templateUrl: './to-do-movie.component.html',
  styleUrl: './to-do-movie.component.css'
})
export class ToDoMovieComponent implements OnInit, AfterViewInit {

  protected moviesId!: string []
  protected movies! : Movie[]
  protected movieEvent! : Movie
  protected movieIncludeActor! : Movie

  // Table
  public headerColumns!: HeaderColumn[]
  public data!: DataTreeTable<any>[]
  public id: string = 'movie-tree-table'
  public tableTitle: string = 'Movie Table'
  public loading!: boolean
  public scrollable: boolean = true
  public paginator: boolean = true
  public rowsScope: number = 3


  // Sub Table
  public visibleSubTable: boolean = false;
  public headerColumnsSubTable!: HeaderColumn[]
  public dataSubTable!: DataTreeTable<any>[]
  public idSubTable: string = 'actor-tree-table'
  public tableTitleSubTable: string = 'Actor Table'
  public loadingSubTable!: boolean
  public scrollableSubTable: boolean = true
  public paginatorSubTable: boolean = true
  public rowsScopeSubTable: number = 3

  // Form Create
  public formGroupCreate!: FormGroup;
  public formTitleCreate: string = 'Movie Form Create';
  public dynamicIconFields!: DynamicIconField[];

  // Form Edit
  public formGroupUpdate!: FormGroup;
  public formTitleUpdate: string = 'Movie Form Update';
  public visibleFormUpdate: boolean = false;
  public draggableFormUpdate: boolean = false;
  public resizableFormUpdate: boolean = false;
  public dynamicDialogFields!: DynamicDialogField[]


  // Dialog
  public visibleConfirm: boolean = false;
  public draggableConfirm: boolean = false;
  public resizableConfirm: boolean = false;
  public dynamicDialogConfirm! : DynamicDialogConfirm
  private modeDialog! : 'DELETE' | 'SUBMIT'| 'WARN'

  constructor(private movieHttpService: MovieHttpService) {}

  ngAfterViewInit(): void {
    this.setupTable()
  }

  ngOnInit(): void {
    this.setDialogConfirm()
    this.setupFormGroupCreate()
    this.setupFormGroupUpdate()
    this.reloadMovies()
    this.reloadMoviesId()
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
        const mid = this.movieEvent.mid
        // console.log(mid)
        /*this.actorHttpService.deleteDeleteOneByPk(aid).subscribe(res => {
          if (res) {
            this.reloadActors()
            this.reloadActorsId()
            this.setupTable()
          }
        }, (error) => {
          console.error(error)
        })*/
        break;
    }
    this.visibleConfirm = false
  }

  protected setCloseEventDialogConfirm() {
    this.visibleConfirm = false
  }

  private getDynamicDialogConfirm(mode: 'DELETE' | 'CREATE' | 'UPDATE' | 'WARN'| 'WARN_SQL' | 'INVALID' ,content?:string) {
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
      let actorsFormat: { data: Movie, subData: Movie [] | null } [] = []
      this.movies.forEach(movie => (actorsFormat.push({data: movie, subData: null})) )
      this.data = UsefulHelper.convertModelToDataTreeTable(actorsFormat)
      this.headerColumns = UsefulHelper.convertObjectToHeaderColumns(this.data[0].data, ["actors"])
    }, 500)
  }

  protected setInitialData($event: DataTreeTable<any>[]) {
    this.data = $event;
  }

  protected setEditEventTreeTable($event: Movie) {

    this.formGroupUpdate.patchValue({
      mid: $event.mid,
      title: $event.title,
      categories: $event.categories,
      rate: $event.rate,
      year: $event.year
    } )

    this.visibleFormUpdate = true
  }

  protected setRemoveEventTreeTable($event: Movie) {
     this.modeDialog = 'DELETE'
     this.movieEvent = $event
     this.dynamicDialogConfirm = this.getDynamicDialogConfirm(this.modeDialog) // set alert
  }

  protected setOptionalEventTreeTable($event: Movie) {
    this.movieEvent = $event
    this.tableTitleSubTable = 'Actor Table Of Movie '+this.movieEvent.mid
    this.reloadMovieIncludeActors(this.movieEvent.mid)
    this.setupTableSubTable()
  }

  // Sub Table
  private setupTableSubTable() {
    setTimeout(() => {
      this.loadingSubTable = false
      let actorsFormat: { data: Actor, subData: Actor [] | null }[] = []
      this.movieIncludeActor.actors.forEach(actor   => (actorsFormat.push({data: actor, subData: null})) )
      this.dataSubTable = UsefulHelper.convertModelToDataTreeTable(actorsFormat)
      this.movieIncludeActor.actors[0] !== undefined // if true
        ? this.headerColumnsSubTable = UsefulHelper.convertObjectToHeaderColumns(this.movieIncludeActor.actors[0]  , ["movies","action"]) // do
        : UsefulHelper.convertObjectToHeaderColumns({mid:null,title:null,categories:null,rate:null,year:null} ,["action"]) // else
    }, 500)
  }

  protected setInitialDataSubTable($event: DataTreeTable<any>[]) {
    this.dataSubTable = $event;
  }




  // Form Update
  private setupFormGroupUpdate() {
    this.formGroupUpdate = new FormGroup({})
    this.dynamicDialogFields = [
      new DynamicDialogField('MID', 'mid', 'e-mid', new FormControl(null, Validators.required), null, 'alpha', undefined, true),
      new DynamicDialogField('TITLE', 'title', 'e-title', new FormControl(null, Validators.required), 'Ride Along', null),
      new DynamicDialogField('CATEGORIES', 'categories', 'e-categories', new FormControl(null, Validators.required), 'Action,Comedy', null),
      new DynamicDialogField('RATE', 'rate', 'e-rate', new FormControl(null, [Validators.maxLength(3), Validators.required]), '5.5', 'num'),
      new DynamicDialogField('YEAR', 'year', 'e-year', new FormControl(null, [ Validators.required]), null, null,'date'),
    ]
  }

  protected setInitialFormGroupUpdate($event: FormGroup) {
    this.formGroupUpdate = $event
    // console.log(this.formGroupUpdate)
  }

  protected setSubmitEventFormGroupUpdate() {
    if (this.formGroupUpdate.valid) {
      const values = this.formGroupUpdate.value
      const movie = new Movie()
      movie.mid = values['mid']
      movie.year = values['year']
      movie.title = values['title']
      movie.categories = values['categories']
      movie.rate = values['rate']
      this.movieHttpService.putEditOne(movie).subscribe(res => {
        if (res) {
          this.reloadMovies()
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
      year: null,
      title: null,
      categories: null,
      rate: null
    })
  }

  protected setCloseEventFormGroupUpdate() {
    this.visibleFormUpdate = false
  }


  // Form Create
  private setupFormGroupCreate() {
    this.formGroupCreate = new FormGroup({})
    this.dynamicIconFields = [
      new DynamicIconField('MID', 'mid', new FormControl(null, [Validators.maxLength(4), Validators.required]), 'mid', false).setInputText(true).setPKeyFilter(null).setPlaceholder('M001'),
      new DynamicIconField('TITLE', 'title', new FormControl(null, Validators.required), 'title', false).setInputText(true).setPKeyFilter(null).setPlaceholder('Ride Along'),
      new DynamicIconField('CATEGORIES', 'categories', new FormControl(null, Validators.required), 'categories', false).setInputText(true).setPKeyFilter(null).setPlaceholder('Action,Comedy'),
      new DynamicIconField('RATE', 'rate', new FormControl(null, [Validators.maxLength(3), Validators.required]), 'rate', false).setInputText(true).setPKeyFilter('num').setPlaceholder('5.5'),
      new DynamicIconField('YEAR', 'year', new FormControl(null, [Validators.required]), 'year', false).setInputDate(true).setPKeyFilter(null),
    ]
  }

  protected setInitialFormGroupCreate($event: FormGroup) {
    this.formGroupCreate = $event
  }

  protected setSubmitEventFormGroupCreate() {
    if (this.formGroupCreate.valid) {
      const values = this.formGroupCreate.value
      if (this.moviesId.indexOf(values['mid']) === -1) {
        const movie = new Movie()
        movie.mid = values['mid']
        movie.year = values['year']
        movie.title = values['title']
        movie.categories = values['categories']
        movie.rate = values['rate']
        this.movieHttpService.postSaveOne(movie).subscribe(res => {
          if (res) {
            this.reloadMovies()
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
  private reloadMovies() {
    this.loading = true
    this.movieHttpService.getSelectAll().subscribe(data => (this.movies = data))
  }

  private reloadMoviesId() {
    this.moviesId = []
    this.movieHttpService.getSelectAllMids().subscribe(data => (this.moviesId = data))
  }

  private reloadMovieIncludeActors(mid : string) {
    this.loadingSubTable = true
    this.visibleSubTable = true
    this.movieHttpService.getSelectOneIncludeRelationByPk(mid).subscribe(data => (this.movieIncludeActor = data))
  }

}
