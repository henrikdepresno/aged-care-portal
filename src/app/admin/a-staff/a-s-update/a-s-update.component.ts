import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-a-s-update',
  templateUrl: './a-s-update.component.html',
  styleUrls: ['./a-s-update.component.scss']
})
export class A_S_UpdateComponent implements OnInit {

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
        this.adminService.updateId.subscribe(id => {
          this.id = id
          $('#staffID').val(id);
        });
      }
    });

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
    const sFirstName = capitalize($('#inputFirstName').val());
    const sLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const role = capitalize($('#inputRole').val());
    
    const updates = this.showUpdates(sFirstName, sLastName, phone, role)
    if(updates != "") {
      if(isNumeric(phone)) {
        swal({
          title: "New updates:",
          text: updates,
          icon: "info",
          dangerMode: true,
          buttons: {
            cancel: "Cancel",
            ok: "Update"
          }
        } as any)
        .then((willUpdate) => {
          if(willUpdate) {
            this.adminService.updateStaff(this.id, sFirstName, sLastName, phone, role);
            swal({
              title: "Success!",
              text: "Details updated!",
              icon: "success",
              buttons: {
                ok: "OK"
              }
            } as any)
          }
        });
      }
      else {
        swal({
          title: "Error!",
          text: "The provided phone number can only be digits!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
      }
    }
    else {
      swal({
        title: "Error!",
        text: "Please update at least one field!",
        icon: "error",
        buttons: {
          ok: "OK"
        }
      } as any)
    }
  }

  private showUpdates(sFirstName, sLastName, phone, role) {
    let updates = "";
    updates += (sFirstName == "") ? "" : "First Name: " + sFirstName + "\n";
    updates += (sLastName == "") ? "" : "Last Name: " + sLastName + "\n";
    updates += (phone == "") ? "" : "Phone: " + phone + "\n";
    updates += (role == "") ? "" : "Role: " + role + "\n";
    return updates;
  }
}