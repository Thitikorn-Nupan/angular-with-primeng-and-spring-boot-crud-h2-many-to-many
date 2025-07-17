import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Actor} from "../entities/actor";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class ActorHttpService {

  private readonly baseEndpoint: string = environment.baseUrl+'/actor';


  constructor(private http: HttpClient) {
  }

  public getSelectAll() {
    return this.http.get<Actor[]>(this.baseEndpoint+'/selectAll')
  }

  public getSelectOneByPk(aid : string) {
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
  }

}
