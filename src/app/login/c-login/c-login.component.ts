import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-c-login',
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.scss']
})
export class C_LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginComponent: LoginComponent,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/login', 'login-c']);
    this.loginComponent.spanLogin('c');
    // 'Enter' when selecting input fields will run
    $('#inputContractorID, #inputContractorPassword').keyup(e => {
      if(e.which == 13) {
        this.loginContractor();
      }
    });
  }

  loginContractor() {
    // Initialize temporary attributes which values taken from the input fields
    const id = $('#inputContractorID').val().toUpperCase();
    const password = $('#inputContractorPassword').val();
    // Login with input ID and password as a contractor
    this.authService.login(id, password, "contractor");
  }

}
