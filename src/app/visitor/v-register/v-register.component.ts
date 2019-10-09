import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { capitalize, isNumeric, isEmail } from '../../functions';

@Component({
  selector: 'app-v-register',
  templateUrl: './v-register.component.html',
  styleUrls: ['./v-register.component.scss']
})
export class V_RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.router.navigate(['/register']);

    // 'Enter' when selecting input field will run
    $('#inputFirstName, #inputLastName, #inputPhone, #inputEmail, #inputResidentFirstName, #inputResidentLastName, #inputPassword, #inputConfirmPassword')
    .keyup(e => {
      if(e.which == 13) {
        this.register();
      }
    });
  }

  register() {
    // Initialize temporary attributes which values taken from the input fields
    // Capitalize some fields if needed
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();
    const confirmPassword = $('#inputConfirmPassword').val();
    const vFirstName = capitalize($('#inputFirstName').val());
    const vLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const rFirstName = capitalize($('#inputResidentFirstName').val());
    const rLastName = capitalize($('#inputResidentLastName').val());
    
    // Check if the provided email is in the right format
    if(isEmail(email)) {
      // Check if the provided password length is 8 or more
      if(password.length >= 8) {
        // Check if the confirmation password matches the input password
        if(password == confirmPassword) {
          // Check if there are any empty fields
          if(email != "" && vFirstName != "" && vLastName != "" && phone != "" && rFirstName != "" && rLastName != "") {
            // Check if the provided phone number is numeric
            if(isNumeric(phone)) {
              this.authService.registerVisitor(email, password, vFirstName, vLastName, phone, rFirstName, rLastName);
            }
            else {
              this.swalError("The phone number can only be digits!")
            }
          }
          else {
            this.swalError("Some fields are left empty!")
          }
        }
        else {
          this.swalError("The password and confirmation password do not match!")
        }
      }
      else {
        this.swalError("Password must be at least 8 characters long!")
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
