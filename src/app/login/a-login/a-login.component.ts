import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-a-login',
  templateUrl: './a-login.component.html',
  styleUrls: ['./a-login.component.scss']
})
export class A_LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginComponent: LoginComponent,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/login', 'login-a']);
    this.loginComponent.spanLogin('a');
    // 'Enter' when selecting input fields will run
    $('#inputAdminID, #inputAdminPassword').keyup(e => {
      if(e.which == 13) {
        this.loginAdmin();
      }
    });
  }

  loginAdmin() {
    // Initialize temporary attributes which values taken from the input fields
    const id = $('#inputAdminID').val().toUpperCase();
    const password = $('#inputAdminPassword').val();
    // Login with input ID and password as an admin
    this.authService.login(id, password, "admin");
  }

}
