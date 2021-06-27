import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MinutesComponent } from './components/minutes/minutes.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'actas', component: MinutesComponent
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
