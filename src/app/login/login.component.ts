import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.navigateLoggedUser().then(res => {
      if(res) {
        this.router.navigate(['/login', 'login-v']);
      }
    });
  }

  navigateLoggedUser() {
    return new Promise((resolve, reject) => {
      this.authService.navigateToHome(true);
      resolve(this.router.url.includes("/login"));
    })
  }

  spanLogin(spanChar: string) {
    $('a.span-login').css({
      '-webkit-box-shadow': '0px 0px 0px 0px',
      '-moz-box-shadow': '0px 0px 0px 0px',
      'box-shadow': '0px 0px 0px 0px',
    });
    $('a#span-login-' + spanChar).css({
      '-webkit-box-shadow': '0px -5px 0px 0px #7B8188 inset',
      '-moz-box-shadow': '0px -5px 0px 0px #7B8188 inset',
      'box-shadow': '0px -5px 0px 0px #7B8188 inset',
    });
  }

}
