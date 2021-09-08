import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePreminuteComponent } from './components/create-preminute/create-preminute.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { LoginComponent } from './components/login/login.component';
import { MinuteCollabComponent } from './components/minute-collab/minute-collab.component';
import { MinutesComponent } from './components/minutes/minutes.component';

import { UserLoggedInGuard } from 'src/app/guards/user-logged-in.guard'
import { UserNotLoggedGuard } from 'src/app/guards/user-not-logged.guard'
import { UserIsAdminGuard } from 'src/app/guards/user-is-admin.guard'
import { UsersComponent } from './components/users/users.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UserNotLoggedGuard]
  },
  {
    path: 'actas', 
    component: MinutesComponent,
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'tablero',
    component: KanbanComponent,
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'recordatorios',
    component: NotificationsComponent,
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'preparar-acta',
    component: CreatePreminuteComponent,
    canActivate: [UserLoggedInGuard, UserIsAdminGuard]
  },
  {
    path: 'acta/:minuteId',
    component: MinuteCollabComponent,
    canActivate: [UserLoggedInGuard]
  },
  {
    path: 'acta/editar/:id',
    component: CreatePreminuteComponent,
    canActivate: [UserLoggedInGuard, UserIsAdminGuard]
  },
  {
    path: 'usuarios',
    component: UsersComponent,
    canActivate: [UserLoggedInGuard]
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
