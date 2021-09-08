import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm : FormGroup = this.fb.group({
    email: [null, Validators.compose([
      Validators.required, Validators.email
    ])],
    password: [null, Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    const {
      loginForm: {
        value: userCredentials
      },
      authService
    } =  this
    
    authService.logIn(userCredentials)
    .subscribe(response => {
      this.router.navigate(['/actas'])
    },
    response => {
      const {
        error: {
          message
        }
      } = response
      this.snackBar.open(message, '', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'error-notification',
        duration: 5000
      })
    })
  }

}
