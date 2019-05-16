import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit {

    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.title = "Identificate";
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    }

    ngOnInit() {
        console.log('Componente del Login cargado...');
    }
    onSubmit() {
        //Logear al usuario y conseguir sus datos
        this._userService.singup(this.user).subscribe(
            response => {
                this.identity = response.user;
                if (!this.identity || !this.identity._id) {
                    this.status = "error";
                } else {
                    //PERSISTIR LOS DATOS
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    //Conseguir Token
                    this.getToken();
                }
            },
            error => {
                let errorMessage = <any>error;
                if (errorMessage != null) {
                    this.status = 'error';
                    console.log(errorMessage);
                }
            }
        );
        console.log(this.user);
    }
    getToken() {
        this._userService.singup(this.user,'true').subscribe(
            response => {
                this.token = response.token;
                if (!this.token.length == null) {
                    this.status = "error";
                } else {
                    localStorage.setItem('token', this.token);
                    this.getCounters();
                }
            },
            error => {
                let errorMessage = <any>error;
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }
    getCounters(){
        this._userService.getCounters().subscribe(
            response =>{
                localStorage.setItem('stats',JSON.stringify(response));
                this.status = 'success';
                this._router.navigate(['/']);
            },
            error=>{
                console.log(<any>error);
            }
        );
    }

}


