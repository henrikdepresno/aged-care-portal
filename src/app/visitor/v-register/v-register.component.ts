import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
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

    $('#inputFirstName, #inputLastName, #inputPhone, #inputEmail, #inputResidentFirstName, #inputResidentLastName, #inputPassword, #inputConfirmPassword')
    .keyup(e => {
      if(e.which == 13) {
        this.register();
      }
    });
  }

  register(){
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();
    const confirmPassword = $('#inputConfirmPassword').val();
    const vFirstName = capitalize($('#inputFirstName').val());
    const vLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const rFirstName = capitalize($('#inputResidentFirstName').val());
    const rLastName = capitalize($('#inputResidentLastName').val());
    if(password.length < 8) {
      if(password == confirmPassword) {
        if(email != "" && vFirstName != "" && vLastName != "" && phone != "" && rFirstName != "" && rLastName != "") {
          if(isNumeric(phone)) {
            if(isEmail(email)) {
              this.authService.registerVisitor(email, password, vFirstName, vLastName, phone, rFirstName, rLastName);
            }
            else {
              this.swalError("The provided email is not valid!")
            }
          }
          else {
            this.swalError("The provided phone number can only be digits!")
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
