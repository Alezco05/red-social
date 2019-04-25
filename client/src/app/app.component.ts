import { Component, OnInit, DoCheck } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {GLOBAL} from './services/global';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faRegistered } from '@fortawesome/free-solid-svg-icons';
import { UserService } from './services/user.service';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title: string
  public inicio: string;
  public personas: string;
  public timeline: string;
  public url: string;
  faHome = faHome;
  faList = faList;
  faUser = faUser;
  faUsers = faUsers;
  faUserEdit =faUserEdit;
  faSignInAlt = faSignInAlt;
  faSignOutAlt = faSignOutAlt;
  faRegistered = faRegistered;
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;
  faUserCheck = faUserCheck;
  faImage = faImage;
  faWindowClose = faWindowClose;
  faTrash = faTrash;
  public identity;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.title = 'La red de Jhon';
    this.inicio = 'Inicio';
    this.timeline = 'Timeline'
    this.personas = 'Personas';
    this.url = GLOBAL.url  
  }
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
  }
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }
  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }
}

