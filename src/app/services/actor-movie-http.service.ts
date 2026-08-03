import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActorMovie} from "../entities/actor-movie";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActorMovieHttpService {

  private readonly baseEndpoint: string = environment.baseUrl + '/actorMovie';


  constructor(private readonly http: HttpClient) {
  }

  public postSaveOne(actorMovie: ActorMovie): Observable<boolean> {
    return this.http.post<boolean>(this.baseEndpoint + '/saveOne', actorMovie)
  }

  public deleteDeleteOneByPk(aid: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseEndpoint + '/deleteOneByPk?aid=' + aid)
  }

}
