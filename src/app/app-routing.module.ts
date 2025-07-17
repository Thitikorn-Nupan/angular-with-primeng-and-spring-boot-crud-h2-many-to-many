import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ToDoActorComponent} from "./components/to-do-actor/to-do-actor.component";
import {ToDoMovieComponent} from "./components/to-do-movie/to-do-movie.component";
import {ToDoActorAndMovieComponent} from "./components/to-do-actor-and-movie/to-do-actor-and-movie.component";

const routes: Routes = [
  { path: 'to-do-actor', component: ToDoActorComponent },
  { path: 'to-do-movie', component: ToDoMovieComponent },
  { path: 'to-do-actor-and-movie', component: ToDoActorAndMovieComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})], // easier for deploy
  exports: [RouterModule]
})
export class AppRoutingModule { }
