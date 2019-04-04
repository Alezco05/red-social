import {Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';
import {PublicationService} from '../../services/publication.service';
//import {UploadService} from '../../services/upload.service';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers: [UserService, PublicationService]
})
export class SidebarComponent implements OnInit {
	public identity;
	public token;
	public stats;
	public url;
	public status;
	public publication: Publication;

	constructor(
		private _userService: UserService,
		private _PublicationService :PublicationService,
		private _route: ActivatedRoute,
		private _router: Router
		) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		this.publication = new Publication("","","","",this.identity._id);

	}

	ngOnInit() {
		console.log("sidebar.component ha sido cargado!!");
	}
	onSubmit(form) {
		this._PublicationService.addPublication(this.token,this.publication).subscribe(
			response =>{
				if(response){
					//this.publication = response.publication;
					this.status = 'success';
					form.reset();
					this._router.navigate(['/timeline']);
				}
				else{
					this.status = 'error';
				}
			},
			error =>{
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage !=null){
					this.status = 'error';
				}
			}
		);
	}

		// Output
		@Output() sended = new EventEmitter();
		sendPublication(event){
			this.sended.emit({send:'true'});
		}

}