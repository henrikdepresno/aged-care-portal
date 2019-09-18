import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../auth.service';
import swal from 'sweetalert';

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
    $('#inputContractorID, #inputContractorPassword').keyup(e => {
      if(e.which == 13) {
        this.loginContractor();
      }
    });
  }

  loginContractor() {
    const id = $('#inputContractorID').val().toUpperCase();
    const password = $('#inputContractorPassword').val();
    this.authService.login(id, password, "contractor");
  }

}
