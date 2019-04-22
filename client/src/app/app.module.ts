import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {appRoutingProviders} from './app.routing'; 
import {routing} from './app.routing'; 


import { AppComponent } from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import {UsersComponent} from './components/users/users.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {PublicationsComponent} from './components/publications/publications.component'
import {ProfileCompenent} from './components/profile/profile.component';
//
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MomentModule} from 'angular2-moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { faRegistered } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';


library.add(faHome);
library.add(faList);
library.add(faUser);
library.add(faUsers);
library.add(faSignInAlt);
library.add(faUserEdit);
library.add(faSignOutAlt);
library.add(faRegistered);
library.add(faUserPlus);
library.add(faUserMinus);
library.add(faUserCheck);
library.add(faImage);
library.add(faWindowClose);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent,
    ProfileCompenent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    MomentModule,
    HttpClientModule,
    routing
    
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
