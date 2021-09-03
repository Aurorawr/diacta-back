import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";

import { AuthService } from 'src/app/services/auth/auth.service'

@Injectable({
  providedIn: 'root'
})
export class UserIsAdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.auth.isAdmin()) {
      this.router.navigate(['/actas'])
    }
    return true;
  }
  
}
