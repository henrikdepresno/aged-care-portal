import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import QRCode from 'qrcode';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { ContractorService } from '../contractor.service';
import { isNumeric } from 'src/app/functions';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-c-update',
  templateUrl: './c-update.component.html',
  styleUrls: ['./c-update.component.scss']
})
export class C_UpdateComponent implements OnInit {

  // The logged contractor ID
  id: string;

  // Predefined properties
  private justCheckOut: boolean;
  private cName: string;
  private email: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private contractorService: ContractorService
  ) { }

  ngOnInit() {
    this.router.navigate(['/contractor', 'update']);

    this.validateUserType().then(res => {
      if(res) {
        this.contractorService.getAuthState().pipe(
          mergeMap(authState => {
            // Get query snapshot to get logged contractor ID
            return this.contractorService.getQuerySnapshotByEmail(authState.email, 'contractor');
          }),
          mergeMap(querySnapshot => {
            // Get the logged contractor ID
            this.id = this.contractorService.getIdFromEmailQuerySnapshot(querySnapshot);
            // Generate QR code to canvas
            QRCode.toCanvas(document.getElementById('qrcode'), this.id, {scale: 9});
            return this.contractorService.getContractorById(this.id)
          }))
          .subscribe(contractor => {
            // Get certain info from contractor to ask for feedback
            this.justCheckOut = contractor.justCheckOut;
            this.cName = contractor.cFirstName + ' ' + contractor.cLastName
            this.email = contractor.email
            if(this.justCheckOut) {
              this.provideFeedback();
            }
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
      resolve(this.router.url.includes("/contractor/update"));
    })
  }

  toggleQRCode(toggle: boolean) {
    // Lock user from scrolling the webpage when QR canvas is shown
    if(toggle) {
      $('div#qr-container').show();
      $('body').addClass('stop-scrolling');
      $('.stop-scrolling').css({
        "height": "100%",
        "overflow": "hidden"
      });
    } else {
      $('div#qr-container').hide();
      $('.stop-scrolling').css({
        "height": "auto",
        "overflow": "visible"
      });
      $('body').removeClass('stop-scrolling');
    }
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
            this.contractorService.updateDetails(this.id, phone);
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

  // Only run if justCheckOut = true
  provideFeedback() {
    // Return an alert asking for feedback
    Swal.fire({
      title: "Hi!",
      html: `Since you recently visited our facility,<br>
      do you want to provide feedback about the visit?`,
      type: 'question',
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes"
    })
    .then((willProvide) => {
      if(willProvide.value) { // If willing to provide
        this.provideContext();
      }
      else { // If not, stop the asking loop
        this.contractorService.provideFeedback(this.id, false)
      }
    });
  }

  private provideContext(inputTitle?: string, inputContext?: string) {
    inputTitle = (inputTitle == undefined) ? '' : inputTitle;
    inputContext = (inputContext == undefined)? '' : inputContext;
    // Return an alert with two input text fields: title & context
    Swal.fire({
      title: 'Please provide details of your visit',
      html:
        '<input id="swal-title" class="swal2-input" placeholder="Title" value="'+ inputTitle +'">' +
        '<input id="swal-context" class="swal2-input" placeholder="Context" value="'+ inputContext +'">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: (<HTMLInputElement>document.getElementById('swal-title')).value,
          context: (<HTMLInputElement>document.getElementById('swal-context')).value
        }
      }
    })
    .then((values) => {
      const title = values.value.title;
      const context = values.value.context;
      if(title != '' && context != '') {
        // Return a confirmation alert
        Swal.fire({
          html: `Feedback: ${title}<br>
          Details: ${context}`,
          type: 'info',
          showCancelButton: true,
          reverseButtons: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Submit Feedback"
        })
        .then((confirmFeedback) => {
          if(confirmFeedback.value) {
            // Add the feedback to the collection and stop the asking loop
            this.contractorService.provideFeedback(this.id, true, this.cName, this.email, title, context)
          }
          else {
            // Loop back to ask if the contractor want to provide a feedback
            this.provideFeedback();
          }
        })
      }
      else { // Return an alert if both fields are empty
        Swal.fire({
          title: "Error!",
          html: "Please do not leave the fields empty!",
          type: "error"
        })
        .then(() => {
          // Loop back to two fields with the previous inputs
          this.provideContext(title, context);
        })
      }
    })
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-c']);
  }
}
