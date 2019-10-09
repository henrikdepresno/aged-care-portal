import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-a-r-add',
  templateUrl: './a-r-add.component.html',
  styleUrls: ['./a-r-add.component.scss']
})
export class A_R_AddComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-add']);

    this.validateUserType();

    // 'Enter' when selecting input fields will run
    $('#inputFirstName, #inputLastName, #inputPhone').keyup(e => {
      if(e.which == 13) {
        this.addResident();
      }
    });
  }

  validateUserType() {
    return new Promise(() => {
      this.authService.checkUserType();
    })
  }

  addResident(){
    // Initialize temporary attributes which values taken from the input fields
    // Capitalize some fields if needed
    const rFirstName = capitalize($('#inputFirstName').val());
    const rLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    // Check if there are any empty fields
    if(rFirstName != "" && rLastName != "" && phone != "") {
      // Check if the provided phone number is numeric
      if(isNumeric(phone)) {
        // Return a success alert
        Swal.fire({
          title: "Success!",
          html: "Resident added",
          type: 'success'
        })
        .then(() => {
          this.adminService.addResident(rFirstName, rLastName, phone);
        });
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
