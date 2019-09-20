import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { EmailService } from '../email.service';
import { isEmail } from '../functions';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private router: Router,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.router.navigate(['/reset-password']);

    $('#inputEmail, #inputConfirmEmail')
    .keyup(e => {
      if(e.which == 13) {
        this.submitResetEmail();
      }
    });
  }

  submitResetEmail(){
    const email = $('#inputEmail').val();
    const confirmEmail = $('#inputConfirmEmail').val();
    if(isEmail(email)) {
      if(email == confirmEmail) {
        this.emailService.emailResetPassword(email);
      }
      else {
        this.swalError("The email and confirmation email do not match!")
      }
    }
    else {
      this.swalError("The provided email is not valid!")
    }
  }

  private swalError(errorText: string) {
    swal({
      title: "Error!",
      text: errorText,
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any)
  }
}
