import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-a-c-update',
  templateUrl: './a-c-update.component.html',
  styleUrls: ['./a-c-update.component.scss']
})
export class A_C_UpdateComponent implements OnInit {

  // The selected contractor ID
  id: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-update']);

    this.validateUserType().then(res => {
      if(res) {
        // Get the passed contractor ID
        this.adminService.updateId.subscribe(id => {
          this.id = id
          $('#contractorID').val(id);
        });
      }
    });

    // 'Enter' when selecting input fields will run
    $('#inputFirstName, #inputLastName, #inputPhone, #inputCompanyName, #inputField').keyup(e => {
      if(e.which == 13) {
        this.updateContractor();
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/contractor-update"));
    })
  }

  updateContractor() {
    // Initialize temporary attributes which values taken from the input fields
    // Capitalize some fields if needed
    const cFirstName = capitalize($('#inputFirstName').val());
    const cLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const companyName = $('#inputCompanyName').val();
    const field = capitalize($('#inputField').val());
    
    const updates = this.showUpdates(cFirstName, cLastName, phone, companyName, field)
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
            this.adminService.updateContractor(this.id, cFirstName, cLastName, phone, companyName, field);
            // Return a success alert
            Swal.fire({
              title: "Success!",
              html: "Details updated!",
              type: 'success'
            })
          }
        })
      }
      else { // Return an alert if the provided phone number is not numeric
        Swal.fire({
          title: "Error!",
          html: "The phone number can only be digits!",
          type: 'error'
        })
      }
    }
    else { // Return an alert if all fields are empty
      Swal.fire({
        title: "Error!",
        html: "Please update at least one field!",
        type: 'error'
      })
    }
  }

  // Generate a string with all input updates
  private showUpdates(cFirstName, cLastName, phone, companyName, field) {
    let updates = "";
    updates += (cFirstName == "") ? "" : "First Name: " + cFirstName + "<br>";
    updates += (cLastName == "") ? "" : "Last Name: " + cLastName + "<br>";
    updates += (phone == "") ? "" : "Phone: " + phone + "<br>";
    updates += (companyName == "") ? "" : "Company Name: " + companyName + "<br>";
    updates += (field == "") ? "" : "Field: " + field;
    return updates;
  }
}
