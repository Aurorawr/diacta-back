import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {Router} from "@angular/router";

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup = this.fb.group({
    email: [null, Validators.compose([
      Validators.required, Validators.email
    ])],
    password: [null, Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    const {
      loginForm: {
        value: userCredentials
      },
      authService
    } =  this
    
    authService.logIn(userCredentials)
    .subscribe(user => {
      console.log(user)
      this.router.navigate(['/actas'])
    },
    error => {
      console.error(error)
    })
  }

}
