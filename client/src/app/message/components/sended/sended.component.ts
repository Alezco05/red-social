import {Component, OnInit,DoCheck} from '@angular/core';

@Component({
    selector: 'sended',
    templateUrl: './received.component.html'
})
export class ReceivedComponent implements OnInit{
    public title: string;
    constructor(){
        this.title = 'Mesajes recividos';

    }
    ngOnInit(){
        console.log('received.component cargado');
    }
}