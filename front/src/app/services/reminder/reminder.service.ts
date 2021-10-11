import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Reminder } from 'src/app/models/reminder.model';

interface ReminderResponse {
  message: string;
  reminders: Reminder
}

interface RemindersResponse {
  message: string;
  reminders: Reminder[]
}

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  reminderUrl = environment + "reminders"

  constructor(private http: HttpClient) { }

  getUserReminders(userId: string) {
    const url = `${this.reminderUrl}/${userId}`

    return this.http.get<RemindersResponse>(url)
  }

  createReminder(userId: string, reminderData: Reminder) {
    const url = `${this.reminderUrl}/${userId}`

    return this.http.post<ReminderResponse>(url, reminderData)
  }
}
