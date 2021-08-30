import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router'

import { AuthService } from 'src/app/services/auth/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Actas San Miguel';
  logged = true

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url == '/login') {
          this.logged = false
        }
        else {
          this.logged = true
        }
      }
    })
  }

  logOut() {
    this.auth.logOut()
    this.router.navigate(['/login'])
  }

}
