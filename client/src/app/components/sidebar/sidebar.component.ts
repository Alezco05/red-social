import {Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers: [UserService]
})
export class SidebarComponent implements OnInit{
	public identity;
	public token;
	public stats;
	public url;
	public status;
	public publication: Publication;

	constructor(
		private _userService: UserService,
		private _route: ActivatedRoute,
		private _router: Router
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		this.publication = new Publication("","","","",this.identity._id);
	}

	ngOnInit(){
		console.log("sidebar.component ha sido cargado!!");
	}
	onSubmit(){
		console.log(this.publication);
	}

}