import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: [UserService]
})
export class RegisterComponent implements OnInit {

    title: string;
    user: User;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService : UserService
    ) {
        this.title = "Registrate";
        this.user = new User("","","","","","","","");
    }

    ngOnInit() {
        console.log('Componente del Registro cargado...');

    }
    onSubmit(){
        this._userService.registrer(this.user);
    }
}

