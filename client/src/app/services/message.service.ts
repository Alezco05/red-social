import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import {Message} from '../models/message';
@Injectable()
export class MessageService{
    public url: string;
    constructor(private _htpp: HttpClient){
        this.url = GLOBAL.url;
    }
    addMessage(token,message):Observable<any>{
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);
        return this._htpp.post(this.url+'message',params,{headers:headers});
    }
    getMyMessage(token,page=1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);
        return this._htpp.get(this.url+'my-messages/'+page,{headers:headers});
    }
    getEmitMessages(token,page=1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);
        return this._htpp.get(this.url+'messages/'+page,{headers:headers});
    }
}