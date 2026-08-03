import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Movie} from "../entities/movie";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MovieHttpService {

  private readonly baseEndpoint: string = environment.baseUrl + '/movie';

  constructor(private readonly http: HttpClient) {
  }

  public getSelectAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseEndpoint + '/selectAll')
  }

  public getSelectAllNotInAid(aid: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseEndpoint + `/selectAllNotInWhere?uniqSubValue=${aid}`)
  }

  public getSelectOnlyMidsAllNotInAid(aid: string): Observable<string[]> {
    return this.http.get<string[]>(this.baseEndpoint + `/selectAllOnlyColumnNotInWhere?uniqSubValue=${aid}`)
  }

  public getSelectAllMids(): Observable<string[]> {
    return this.http.get<string[]>(this.baseEndpoint + '/selectAllOnlyColumn?name=mid')
  }

  public getSelectOneIncludeRelationByPk(mid: string): Observable<Movie> {
    return this.http.get<Movie>(this.baseEndpoint + '/selectOneIncludeRelationByPk?mid=' + mid)
  }

  public putEditOne(movie: Movie): Observable<boolean> {
    return this.http.put<boolean>(this.baseEndpoint + '/editOne', movie)
  }

  public postSaveOne(movie: Movie): Observable<boolean> {
    return this.http.post<boolean>(this.baseEndpoint + '/saveOne', movie)
  }

  public deleteDeleteOneByPk(mid: string): Observable<boolean> {
    return this.http.delete<boolean>(this.baseEndpoint + '/deleteOneByPk?mid=' + mid)
  }

  /*public getSelectOneByPk(aid : string) {
    return this.http.get<Actor>(this.baseEndpoint+'/selectOneByPk?aid='+aid)
  }

  public getSelectOneIncludeRelationByPk(aid : string) {
    return this.http.get<Actor>(this.baseEndpoint+'/selectOneIncludeRelationByPk?aid='+aid)
  }

  public getSelectAllAids() {
    return this.http.get<string[]>(this.baseEndpoint+'/selectAllOnlyColumn?name=aid')
  }

  public postSaveOne(actor: Actor) {
    return this.http.post<boolean>(this.baseEndpoint+'/saveOne',actor)
  }

  public putEditOne(actor: Actor) {
    return this.http.put<boolean>(this.baseEndpoint+'/editOne',actor)
  }

  public deleteDeleteOneByPk(aid : string) {
    return this.http.delete<boolean>(this.baseEndpoint+'/deleteOneByPk?aid='+aid)
  }*/

}
