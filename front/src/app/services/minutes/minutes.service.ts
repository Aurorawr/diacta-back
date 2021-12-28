import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Minute } from 'src/app/models/minute.model';
import { Preminute } from 'src/app/models/preminute.model';
import { Compromise } from 'src/app/models/compromises.model';
import { environment } from 'src/environments/environment';

interface MinuteResponse {
  message: string;
  minute: Minute;
}

@Injectable({
  providedIn: 'root'
})
export class MinutesService {

  minutesUrl = environment.baseUrl + 'minutes/'

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

  createPreminute(preminute: Preminute) : Observable<any> {
    const {
      minutesUrl,
      http
    } = this;

    return http.post(minutesUrl, preminute);
  }

  updateMinute(newData: Minute) : Observable<any> {
    const {
      minutesUrl,
      http
    } = this;

    const url = minutesUrl +  newData._id

    return http.put(url, newData);
  }

  getPreviousCompromises() {
    const url = this.minutesUrl + 'previousCompromises';

    return this.http.get<Compromise[]>(url);
  }
}
