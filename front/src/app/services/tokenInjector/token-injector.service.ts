import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TokenInjectorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string | null = localStorage.getItem('diacta-token');

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.auth.logOut()
          this.snackBar.open('Su sesión a caducado', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'error-notification',
            duration: 5000
          })
          this.router.navigateByUrl('/login');
        }

        return throwError( err );

      })
    );
  }
}
