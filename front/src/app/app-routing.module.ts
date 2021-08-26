import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePreminuteComponent } from './components/create-preminute/create-preminute.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { LoginComponent } from './components/login/login.component';
import { MinuteCollabComponent } from './components/minute-collab/minute-collab.component';
import { MinutesComponent } from './components/minutes/minutes.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'actas', component: MinutesComponent
  },
  {
    path: 'tablero', component: KanbanComponent
  },
  {
    path: 'preparar-acta', component: CreatePreminuteComponent
  },
  {
    path: 'acta/:minuteId', component: MinuteCollabComponent
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
