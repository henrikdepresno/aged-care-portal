import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric, isEmail } from 'src/app/functions';

@Component({
  selector: 'app-a-c-add',
  templateUrl: './a-c-add.component.html',
  styleUrls: ['./a-c-add.component.scss']
})
export class A_C_AddComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-add']);

    this.validateUserType();

    $('#inputFirstName, #inputLastName, #inputPhone, #inputEmail, #inputCompanyName, #inputField').keyup(e => {
      if(e.which == 13) {
        this.addContractor();
      }
    });
  }

  validateUserType() {
    return new Promise(() => {
      this.authService.checkUserType();
    })
  }

  addContractor() {
    const cFirstName = capitalize($('#inputFirstName').val());
    const cLastName = capitalize($('#inputLastName').val());
    const email = $('#inputEmail').val();
    const phone = $('#inputPhone').val();
    const companyName = $('#inputCompanyName').val();
    const field = capitalize($('#inputField').val());
    if(cFirstName != "" && cLastName != "" && email != "" && phone != "" && companyName != "" && field != "") {
      if(isNumeric(phone)) {
        if(isEmail(email)) {
          swal({
            title: "Success!",
            text: "Contractor added",
            icon: "success",
            buttons: {
              ok: "OK"
            }
          } as any)
          .then(() => {
            this.adminService.addContractor(cFirstName, cLastName, email, phone, companyName, field);
          });
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
