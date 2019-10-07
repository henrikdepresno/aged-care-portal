import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { VisitorService } from '../visitor.service';
import { AuthService } from 'src/app/auth.service';
import { isNumeric } from 'src/app/functions';
import { mergeMap } from 'rxjs/operators';

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
        this.visitorService.getAuthState().pipe(
          mergeMap(authState => {
            return this.visitorService.getQuerySnapshotByEmail(authState.email, 'visitor');
          }))
          .subscribe(querySnapshot => {
            this.id = this.visitorService.getIdFromEmailQuerySnapshot(querySnapshot);
            $('#visitorID').val(this.id);
          })
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
      if(isNumeric(phone) || phone == "") {
        Swal.fire({
          title: "New updates:",
          html: updates,
          type: 'question',
          showCancelButton: true,
          reverseButtons: true,
          focusCancel: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Update"
        })
        .then((willUpdate) => {
          if(willUpdate.value) {
            this.visitorService.updateDetails(this.id, phone);
            Swal.fire({
              title: "Success!",
              html: "Details updated!",
              type: 'success'
            })
          }
        });
      }
      else {
        Swal.fire({
          title: "Error!",
          html: "The phone number can only be digits!",
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

  private showUpdates(phone) {
    let updates = (phone == "") ? "" : "Phone: " + phone;
    return updates;
  }

}
