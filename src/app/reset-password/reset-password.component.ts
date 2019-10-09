import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
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

    // 'Enter' when selecting input fields will run
    $('#inputEmail, #inputConfirmEmail')
    .keyup(e => {
      if(e.which == 13) {
        this.submitResetEmail();
      }
    });
  }

  submitResetEmail(){
    // Initialize temporary attributes which values taken from the input fields
    const email = $('#inputEmail').val();
    const confirmEmail = $('#inputConfirmEmail').val();
    // Check if the input email is in the right format
    if(isEmail(email)) {
      // Check if the confirmation email matches the input email
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

  // Return an error alert
  private swalError(errorText: string) {
    Swal.fire({
      title: "Error!",
      html: errorText,
      type: 'error'
    })
  }
}
