import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
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
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-update']);
    this.adminService.updateId.subscribe(id => this.id = id);
  }

  updateContractor() {
    const cFirstName = capitalize($('#inputFirstName').val());
    const cLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    const companyName = $('#inputCompanyName').val();
    const field = capitalize($('#inputField').val());
    
    const updates = this.showUpdates(cFirstName, cLastName, phone, companyName, field)
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
            this.adminService.updateContractor(this.id, cFirstName, cLastName, phone, companyName, field);
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

  private showUpdates(cFirstName, cLastName, phone, companyName, field) {
    let updates = "";
    updates += (cFirstName == "") ? "" : "First Name: " + cFirstName + "\n";
    updates += (cLastName == "") ? "" : "Last Name: " + cLastName + "\n";
    updates += (phone == "") ? "" : "Phone: " + phone + "\n";
    updates += (companyName == "") ? "" : "Company Name: " + companyName + "\n";
    updates += (field == "") ? "" : "Field: " + field;
    return updates;
  }
}
