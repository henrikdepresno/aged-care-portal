import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { VisitorService } from '../visitor.service';
import { AuthService } from 'src/app/auth.service';
import { isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-v-update',
  templateUrl: './v-update.component.html',
  styleUrls: ['./v-update.component.scss']
})
export class V_UpdateComponent implements OnInit {

  id: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private visitorService: VisitorService
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'update']);

    this.validateUserType().then(res => {
      if(res) { 
        this.visitorService.getId();
        this.visitorService.id.subscribe(id => {
          this.id = id;
          $('#visitorID').val(id);
        });
      }
    });

    $('#inputPhone').keyup(e => {
      if(e.which == 13) {
        this.updateDetails();
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/visitor/update"));
    })
  }

  updateDetails(){
    const phone = $('#inputPhone').val();
    
    const updates = this.showUpdates(phone)
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
            this.visitorService.updateDetails(this.id, phone);
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

  private showUpdates(phone) {
    let updates = (phone == "") ? "" : "Phone: " + phone;
    return updates;
  }

}
