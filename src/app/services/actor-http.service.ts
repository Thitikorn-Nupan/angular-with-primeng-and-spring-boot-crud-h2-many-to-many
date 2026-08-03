import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Actor} from "../entities/actor";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActorHttpService {

  private readonly baseEndpoint: string = environment.baseUrl + '/actor';

  constructor(private readonly http: HttpClient) {
  }

  public getSelectAll(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.baseEndpoint + '/selectAll')
  }

  public getSelectOneByPk(aid: string): Observable<Actor> {
    return this.http.get<Actor>(this.baseEndpoint + '/selectOneByPk?aid=' + aid)
  }

  public getSelectOneIncludeRelationByPk(aid: string): Observable<Actor> {
    return this.http.get<Actor>(this.baseEndpoint + '/selectOneIncludeRelationByPk?aid=' + aid)
  }

  public getSelectAllAids(): Observable<string[]> {
    return this.http.get<string[]>(this.baseEndpoint + '/selectAllOnlyColumn?name=aid')
  }

  public postSaveOne(actor: Actor): Observable<boolean> {
    return this.http.post<boolean>(this.baseEndpoint + '/saveOne', actor)
  }

  public putEditOne(actor: Actor): Observable<boolean> {
    return this.http.put<boolean>(this.baseEndpoint + '/editOne', actor)
  }

  public deleteDeleteOneByPk(aid: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseEndpoint + '/deleteOneByPk?aid=' + aid)
  }

}
