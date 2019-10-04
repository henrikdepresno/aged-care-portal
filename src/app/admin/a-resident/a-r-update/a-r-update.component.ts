import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-a-r-update',
  templateUrl: './a-r-update.component.html',
  styleUrls: ['./a-r-update.component.scss']
})
export class A_R_UpdateComponent implements OnInit {

  id: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-update']);

    this.validateUserType().then(res => {
      if(res) { 
        this.adminService.updateId.subscribe(id => {
          this.id = id
          $('#residentID').val(id);
        });
      }
    });

    $('#inputFirstName, #inputLastName, #inputPhone').keyup(e => {
      if(e.which == 13) {
        this.updateResident();
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/resident-update"));
    })
  }

  updateResident(){
    const rFirstName = capitalize($('#inputFirstName').val());
    const rLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    
    const updates = this.showUpdates(rFirstName, rLastName, phone)
    if(updates != "") {
      if(isNumeric(phone) || phone == "") {
        Swal.fire({
          title: "New updates:",
          text: updates,
          type: 'question',
          showCancelButton: true,
          reverseButtons: true,
          focusCancel: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Update",
        })
        .then((willUpdate) => {
          if(willUpdate.value) {
            this.adminService.updateResident(this.id, rFirstName, rLastName, phone);
            Swal.fire({
              title: "Success!",
              text: "Details updated!",
              type: 'success'
            })
          }
        })
      }
      else {
        Swal.fire({
          title: "Error!",
          text: "The provided phone number can only be digits!",
          type: 'error'
        })
      }
    }
    else {
      Swal.fire({
        title: "Error!",
        text: "Please update at least one field!",
        type: 'error'
      })
    }
  }

  private showUpdates(cFirstName, cLastName, phone) {
    let updates = "";
    updates += (cFirstName == "") ? "" : "First Name: " + cFirstName + "\n";
    updates += (cLastName == "") ? "" : "Last Name: " + cLastName + "\n";
    updates += (phone == "") ? "" : "Phone: " + phone;
    return updates;
  }
}
