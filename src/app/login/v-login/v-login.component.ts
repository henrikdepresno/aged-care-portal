import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { LoginComponent } from '../login.component';
import { AuthService } from '../../auth.service';
import swal from 'sweetalert';

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
    $('#inputVisitorID, #inputVisitorPassword').keyup(e => {
      if(e.which == 13) {
        this.loginVisitor();
      }
    });
  
  }

  loginVisitor() {

    //if email and password do not match, show popup
    swal({
      title: "Error!",
      text: "Wrong email or password",
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any)
    
    // else, log in the user

    const id = $('#inputVisitorID').val().toUpperCase();
    const password = $('#inputVisitorPassword').val();
    this.authService.login(id, password, "visitor");

    
  
  }

}
