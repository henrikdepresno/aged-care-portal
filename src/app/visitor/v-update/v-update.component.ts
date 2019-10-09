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

  // The logged visitor ID
  id: string;

  // Predefined properties
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
            // Get query snapshot to get logged visitor ID
            return this.visitorService.getQuerySnapshotByEmail(authState.email, 'visitor');
          }))
          .subscribe(querySnapshot => {
            // Get the logged visitor ID
            this.id = this.visitorService.getIdFromEmailQuerySnapshot(querySnapshot);
            $('#visitorID').val(this.id);
          })
      }
    });

    // 'Enter' when selecting input field will run
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
    // Initialize temporary attribute which values taken from the input field
    const phone = $('#inputPhone').val();
    
    const updates = this.showUpdates(phone)
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
          confirmButtonText: "Update"
        })
        .then((willUpdate) => {
          if(willUpdate.value) {
            this.visitorService.updateDetails(this.id, phone);
            // Return a success alert
            Swal.fire({
              title: "Success!",
              html: "Details updated!",
              type: 'success'
            })
          }
        });
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
  private showUpdates(phone) {
    let updates = (phone == "") ? "" : "Phone: " + phone;
    return updates;
  }

}
