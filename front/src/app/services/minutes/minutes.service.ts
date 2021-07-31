import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MinuteHeader } from 'src/app/models/minuteHeader/minute-header.model';
import { Minute } from 'src/app/models/minute/minute.model';
import { baseUrl } from 'src/app/services/shared';

interface MinuteResponse {
  message: string;
  minute: Minute;
}

@Injectable({
  providedIn: 'root'
})
export class MinutesService {

  minutesUrl = baseUrl + 'minutes/'

  constructor(private http: HttpClient) { }

  getMinutes() : Observable<any> {
    const {
      minutesUrl,
      http
    } = this;

    return http.get(minutesUrl);
  }

  getMinute(minuteId: string) : Observable<MinuteResponse> {

    const {
      minutesUrl,
      http
    } = this;

    const url = minutesUrl + minuteId;

    return http.get<MinuteResponse>(url);
  }
}
