import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-v-login',
  templateUrl: './v-login.component.html',
  styleUrls: ['./v-login.component.scss']
})
export class V_LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginComponent: LoginComponent,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/login', 'login-v']);
    this.loginComponent.spanLogin('v');
    // 'Enter' when selecting input fields will run
    $('#inputVisitorID, #inputVisitorPassword').keyup(e => {
      if(e.which == 13) {
        this.loginVisitor();
      }
    });
  
  }

  loginVisitor() {
    // Initialize temporary attributes which values taken from the input fields
    const id = $('#inputVisitorID').val().toUpperCase();
    const password = $('#inputVisitorPassword').val();
    // Login with input ID and password as a visitor
    this.authService.login(id, password, "visitor");
  }

}
