import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Actor} from "../entities/actor";
import {ActorMovie} from "../entities/actor-movie";

@Injectable({
  providedIn: 'root'
})
export class ActorMovieHttpService {

  private readonly baseEndpoint: string = 'http://localhost:8080/api/actorMovie';

  constructor(private http: HttpClient) {
  }


  public postSaveOne(actorMovie: ActorMovie) {
    return this.http.post<boolean>(this.baseEndpoint+'/saveOne',actorMovie)
  }


  public deleteDeleteOneByPk(aid : string) {
    return this.http.delete<boolean>(this.baseEndpoint+'/deleteOneByPk?aid='+aid)
  }

}
