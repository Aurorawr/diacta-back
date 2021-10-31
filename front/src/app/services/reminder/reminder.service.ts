import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Reminder } from 'src/app/models/reminder.model';
import { AuthService } from '../auth/auth.service';

interface ReminderResponse {
  message: string;
  reminder: Reminder
}

interface RemindersResponse {
  message: string;
  reminders: Reminder[]
}

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  reminderUrl = environment.baseUrl + "reminders"
  userId = ''

  constructor(private http: HttpClient, private auth: AuthService) {
    const loggedUser = auth.getLoggedUser()
    if (loggedUser) {
      this.userId = loggedUser._id
    }
  }

  getUserReminders(userId: string) {
    const url = `${this.reminderUrl}/${userId}`

    return this.http.get<RemindersResponse>(url)
  }

  createReminder(reminderData: Reminder) {
    const url = `${this.reminderUrl}/${this.userId}`

    return this.http.post<ReminderResponse>(url, reminderData)
  }
}
