import { Component } from '@angular/core';
import { Router } from '@angular/router'

import { AuthService } from 'src/app/services/auth/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Actas San Miguel';

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  logOut() {
    this.auth.logOut()
    this.router.navigate(['/login'])
  }

}
