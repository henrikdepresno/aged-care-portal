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
        this.adminService.updateId.subscribe(id => {
          this.id = id
          $('#contractorID').val(id);
        });
      }
    });

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
    const cFirstName = capitalize($('#inputFirstName').val());
    const cLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const companyName = $('#inputCompanyName').val();
    const field = capitalize($('#inputField').val());
    
    const updates = this.showUpdates(cFirstName, cLastName, phone, companyName, field)
    if(updates != "") {
      if(isNumeric(phone) || phone == "") {
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
            Swal.fire({
              title: "Success!",
              html: "Details updated!",
              type: 'success'
            })
          }
        })
      }
      else {
        Swal.fire({
          title: "Error!",
          html: "The provided phone number can only be digits!",
          type: 'error'
        })
      }
    }
    else {
      Swal.fire({
        title: "Error!",
        html: "Please update at least one field!",
        type: 'error'
      })
    }
  }

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
