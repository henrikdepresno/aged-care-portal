import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../auth.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-s-login',
  templateUrl: './s-login.component.html',
  styleUrls: ['./s-login.component.scss']
})
export class S_LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginComponent: LoginComponent,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/login', 'login-s']);
    this.loginComponent.spanLogin('s');
    $('#inputStaffID, #inputStaffPassword').keyup(e => {
      if(e.which == 13) {
        this.loginStaff();
      }
    });
  }

  loginStaff() {
    const id = $('#inputStaffID').val().toUpperCase();
    const password = $('#inputStaffPassword').val();
    this.authService.login(id, password, "staff");
  }

}