import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
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

    // 'Enter' when selecting input fields will run
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
    // Initialize temporary attributes which values taken from the input fields
    // Capitalize some fields if needed
    const cFirstName = capitalize($('#inputFirstName').val());
    const cLastName = capitalize($('#inputLastName').val());
    const email = $('#inputEmail').val();
    const phone = $('#inputPhone').val();
    const companyName = $('#inputCompanyName').val();
    const field = capitalize($('#inputField').val());
    // Check if there are any empty fields
    if(cFirstName != "" && cLastName != "" && email != "" && phone != "" && companyName != "" && field != "") {
      // Check if the provided phone number is numeric
      if(isNumeric(phone)) {
        // Check if the provided email is in the right format
        if(isEmail(email)) {
          this.adminService.addContractor(cFirstName, cLastName, email, phone, companyName, field);
        }
        else {
          this.swalError("The provided email is not valid!")
        }
      }
      else {
        this.swalError("The phone number can only be digits!")
      }
    }
    else {
      this.swalError("Some fields are left empty!")
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
