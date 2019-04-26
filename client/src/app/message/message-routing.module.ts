import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
//Componentes
import {MainComponent} from './components/main/main.component';
import {AddComponent} from './components/add/add.component';
import {ReceivedComponent} from './components/received/received.component';
import {SendedComponent} from './components/sended/sended.component';

const messageRoutes: Routes = [
    {
        path : 'mensajes',
        component: MainComponent,
        children:[
            {path:"",redirectTo:"recibidos",pathMatch:'full'},
            {path:"enviar",component:AddComponent},
            {path:"recibidos",component:ReceivedComponent},
            {path:"enviados",component:SendedComponent},
        ]

    }
];

@NgModule ({
    imports: [
        RouterModule.forChild(messageRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class MessageRoutingModule{
    
}