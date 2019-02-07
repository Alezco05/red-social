import { Injectable } from '@angular/core';
import {GLOBAL} from './globlal'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';

@Injectable()
export class UserService{
    url:string;
    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
        
    }
    registrer(user_to_registrer){
        console.log(user_to_registrer);
        console.log(this.url);
    }
}