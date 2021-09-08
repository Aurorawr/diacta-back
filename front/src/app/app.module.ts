import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MinuteCollabSocket } from 'src/app/sockets/minute-collab.socket'


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MinutesComponent } from './components/minutes/minutes.component';
import { MinuteComponent } from './components/minute/minute.component';
import { CreatePreminuteComponent } from './components/create-preminute/create-preminute.component';
import { MinuteCollabComponent } from './components/minute-collab/minute-collab.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TokenInjectorService } from 'src/app/services/tokenInjector/token-injector.service';
import { UsersComponent } from './components/users/users.component';
import { AddMemberDialogComponent } from './components/add-member-dialog/add-member-dialog.component';
import { NotificationsComponent } from './components/notifications/notifications.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MinutesComponent,
    MinuteComponent,
    CreatePreminuteComponent,
    MinuteCollabComponent,
    KanbanComponent,
    UsersComponent,
    AddMemberDialogComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInjectorService,
      multi: true
    },
    MinuteCollabSocket
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddMemberDialogComponent
  ]
})
export class AppModule { }
