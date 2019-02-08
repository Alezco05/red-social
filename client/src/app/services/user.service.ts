import { Injectable } from '@angular/core';
import { GLOBAL } from './globlal'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { identity } from 'rxjs';

@Injectable()
export class UserService {
    url: string;
    identity;
    token;
    stats;
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }
    registrer(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'register', params, { headers: headers });
    }
    singup(user: User, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user = Object.assign(user, { gettoken });
        }
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'login', params, { headers: headers });
    }
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        let token = localStorage.getItem('token');
        if (token != "undefined") {
            this.token = token;
        }
        else {
            this.token = null;
        }
        return this.token;
    }
    getStats(){
        let stats = JSON.parse(localStorage.getItem('stats'));
        if(stats != 'undefined'){
            this.stats = stats;
        }else{
            this.stats = stats;
        }

    }
    getCounters(userId = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                      .set('Authorization',this.getToken());
        if(userId !=null){
            return this._http.get(this.url+'counters/'+userId,{headers:headers});
        }else{
            return this._http.get(this.url+'counters',{headers:headers});            
        }
    }
}