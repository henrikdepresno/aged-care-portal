import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric, isEmail } from 'src/app/functions';

@Component({
  selector: 'app-a-s-add',
  templateUrl: './a-s-add.component.html',
  styleUrls: ['./a-s-add.component.scss']
})
export class A_S_AddComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'staff-add']);

    this.validateUserType();

    // 'Enter' when selecting input fields will run
    $('#inputFirstName, #inputLastName, #inputPhone, #inputEmail, #inputRole').keyup(e => {
      if(e.which == 13) {
        this.addStaff();
      }
    });
  }

  validateUserType() {
    return new Promise(() => {
      this.authService.checkUserType();
    })
  }

  addStaff(){
    // Initialize temporary attributes which values taken from the input fields
    // Capitalize some fields if needed
    const sFirstName = capitalize($('#inputFirstName').val());
    const sLastName = capitalize($('#inputLastName').val());
    const email = $('#inputEmail').val();
    const phone = $('#inputPhone').val();
    const role = capitalize($('#inputRole').val());
    // Check if there are any empty fields
    if(sFirstName != "" && sLastName != "" && email != "" && phone != "" && role != "") {
      // Check if the provided phone number is numeric
      if(isNumeric(phone)) {
        // Check if the provided email is in the right format
        if(isEmail(email)) {
          this.adminService.addStaff(sFirstName, sLastName, email, phone, role);
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
