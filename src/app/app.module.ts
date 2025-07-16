import {importProvidersFrom, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MenubarComponent} from './components/menubar/menubar.component';
import {MenubarModule} from "primeng/menubar";
import {ToDoActorComponent} from './components/to-do-actor/to-do-actor.component';
import {ToDoMovieComponent} from './components/to-do-movie/to-do-movie.component';
import {ToDoActorAndMovieComponent} from './components/to-do-actor-and-movie/to-do-actor-and-movie.component';
import {DynamicTreeTableComponent} from "./intermediary-components/dynamic-tree-table/dynamic-tree-table.component";
import {DynamicIconFormComponent} from "./intermediary-components/dynamic-icon-form/dynamic-icon-form.component";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {TreeTableModule} from "primeng/treetable";
import {CardModule} from "primeng/card";
import {InputGroupModule} from "primeng/inputgroup";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {RadioButtonModule} from "primeng/radiobutton";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TreeSelectModule} from "primeng/treeselect";
import {KeyFilterModule} from "primeng/keyfilter";
import {InputTextModule} from "primeng/inputtext";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextareaModule} from "primeng/inputtextarea";
import { CalendarModule } from 'primeng/calendar';
import {ListboxModule} from "primeng/listbox";
import {DynamicDialogFormComponent} from "./intermediary-components/dynamic-dialog-form/dynamic-dialog-form.component";
import {DialogModule} from "primeng/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  DynamicDialogConfirmComponent
} from "./intermediary-components/dynamic-dialog-confirm/dynamic-dialog-confirm.component";

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    DynamicTreeTableComponent,
    DynamicIconFormComponent,
    DynamicDialogFormComponent,
    DynamicDialogConfirmComponent,
    ToDoActorComponent,
    ToDoMovieComponent,
    ToDoActorAndMovieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    TreeTableModule,
    CardModule,
    InputGroupModule,
    ButtonDirective,
    Ripple,
    RadioButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    TreeSelectModule,
    KeyFilterModule,
    InputTextModule,
    InputGroupAddonModule,
    InputTextareaModule,
    CalendarModule,
    FormsModule,
    ListboxModule,
    DialogModule
  ],
  providers: [
    // for http client
    importProvidersFrom([BrowserAnimationsModule]), // works for DialogModule
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
