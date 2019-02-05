import { Component } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string 
  inicio:string; 
  personas:string;
  timeline:string;
  faHome = faHome;
  faList = faList;
  faUser = faUser;



  constructor(){
    this.title ='La red de Jhon';
    this.inicio = 'Inicio';
    this.timeline = 'Timeline'
    this.personas = 'Personas';

  }
}

