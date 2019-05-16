import {Component, OnInit} from '@angular/core';


@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
    title:string;

    constructor(){
       this.title = 'Bienvenido a LA RED DE JHON' 
    }

    ngOnInit(){
        console.log('home.component cargador')
    }
}