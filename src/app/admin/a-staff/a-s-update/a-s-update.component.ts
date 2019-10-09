import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-a-s-update',
  templateUrl: './a-s-update.component.html',
  styleUrls: ['./a-s-update.component.scss']
})
export class A_S_UpdateComponent implements OnInit {

  // The selected staff ID
  id: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'staff-update']);

    this.validateUserType().then(res => {
      if(res) { 
        // Get the passed staff ID
        this.adminService.updateId.subscribe(id => {
          this.id = id
          $('#staffID').val(id);
        });
      }
    });

    // 'Enter' when selecting input fields will run
    $('#inputFirstName, #inputLastName, #inputPhone, #inputRole').keyup(e => {
      if(e.which == 13) {
        this.updateStaff();
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/staff-update"));
    })
  }

  updateStaff() {
    // Initialize temporary attributes which values taken from the input fields
    // Capitalize some fields if needed
    const sFirstName = capitalize($('#inputFirstName').val());
    const sLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const role = capitalize($('#inputRole').val());
    
    const updates = this.showUpdates(sFirstName, sLastName, phone, role)
    // Check if there is any updates
    if(updates != "") {
      // Check if provided phone number is numeric
      if(isNumeric(phone) || phone == "") {
        // Return a confirmation alert
        Swal.fire({
          title: "New updates:",
          html: updates,
          type: 'question',
          showCancelButton: true,
          reverseButtons: true,
          focusCancel: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Update",
        })
        .then((willUpdate) => {
          if(willUpdate.value) {
            this.adminService.updateStaff(this.id, sFirstName, sLastName, phone, role);
            // Return a success alert
            Swal.fire({
              title: "Success!",
              html: "Details updated!",
              type: 'success'
            })
          }
        })
      }
      else {
        Swal.fire({ // Return an alert if the provided phone number is not numeric
          title: "Error!",
          html: "The phone number can only be digits!",
          type: 'error'
        })
      }
    }
    else {
      Swal.fire({ // Return an alert if all fields are empty
        title: "Error!",
        html: "Please update at least one field!",
        type: 'error'
      })
    }
  }

  // Generate a string with all input updates
  private showUpdates(sFirstName, sLastName, phone, role) {
    let updates = "";
    updates += (sFirstName == "") ? "" : "First Name: " + sFirstName + "<br>";
    updates += (sLastName == "") ? "" : "Last Name: " + sLastName + "<br>";
    updates += (phone == "") ? "" : "Phone: " + phone + "<br>";
    updates += (role == "") ? "" : "Role: " + role;
    return updates;
  }
}