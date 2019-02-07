import { Injectable } from '@angular/core';
import { GLOBAL } from './globlal'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';

@Injectable()
export class UserService {
    url: string;
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;

    }
    registrer(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'register', params, { headers: headers });
    }
}