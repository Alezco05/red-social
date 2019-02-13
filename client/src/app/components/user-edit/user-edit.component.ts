import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit{
    public title:string;
    public user: User;
    public identity;
    public token;
    public status:string;
    constructor(
        private _route:ActivatedRoute,
        private _router : Router,
        private _userservice: UserService
    ){
      this.title = 'Actualizar mis datos';
      this.user = this._userservice.getIdentity();
      this.identity = this.user;
      this.token = this._userservice.getToken();
    }
   ngOnInit(){
       console.log(this.user);
       console.log('Componente cargado');
   }
   onSubmit(){
       console.log(this.user);
       this._userservice.updateUser(this.user).subscribe(
           response=>{
               if(!response.user){
                   this.status = 'error';
               }
               else{
                   this.status= 'success';
                   localStorage.setItem('identity', JSON.stringify(this.user));
                   this.identity = this.user;

                   //SUBIDA DE IMAGEN DE USUARIO
                }
           },
           error =>{
               var errorMessage = <any>error;
               console.log(errorMessage);
               if(errorMessage != null){
                   this.status = 'error';
               } 
           }

       );
   }
}
