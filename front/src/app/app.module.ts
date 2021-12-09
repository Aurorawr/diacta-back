import { NgModule } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MinuteCollabSocket } from 'src/app/sockets/minute-collab.socket'
import { TasksSocket } from 'src/app/sockets/tasks.socket'

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MinutesComponent } from './components/minutes/minutes.component';
import { MinuteComponent } from './components/minute/minute.component';
import { CreatePreminuteComponent } from './components/create-preminute/create-preminute.component';
import { MinuteCollabComponent } from './components/minute-collab/minute-collab.component';
import { MinuteCollabEditionComponent } from './components/minute-collab/components/edition/index.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TokenInjectorService } from 'src/app/services/tokenInjector/token-injector.service';
import { UsersComponent } from './components/users/users.component';
import { AddMemberDialogComponent } from './components/add-member-dialog/add-member-dialog.component';
import { NotificationsComponent } from './components/notifications/notifications.component'

import { AddDialogueElementDialog } from './dialogs/add-dialogue-element/index.component';
import { AddAnnexDialog } from './dialogs/add-annex/index.component';
import { AddNoteDialog } from './dialogs/add-note/index.component';
import { AddTopicDialog } from './dialogs/add-topic/index.component';
import { TaskDialog } from './dialogs/task/index.component';
import { ReminderDialog } from './dialogs/reminder/index.component';
import { MeetingPhaseComponent } from './components/shared/meeting-phase/meeting-phase.component';

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
    NotificationsComponent,
    AddDialogueElementDialog,
    AddAnnexDialog,
    AddNoteDialog,
    AddTopicDialog,
    MinuteCollabEditionComponent,
    TaskDialog,
    ReminderDialog,
    MeetingPhaseComponent
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
    MatChipsModule,
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
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
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
    MinuteCollabSocket,
    TasksSocket
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddMemberDialogComponent,
    AddDialogueElementDialog,
    AddAnnexDialog,
    AddNoteDialog,
    AddTopicDialog,
    TaskDialog,
    ReminderDialog
  ]
})
export class AppModule { }
