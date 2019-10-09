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

  id: string;

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
            return this.contractorService.getQuerySnapshotByEmail(authState.email, 'contractor');
          }),
          mergeMap(querySnapshot => {
            this.id = this.contractorService.getIdFromEmailQuerySnapshot(querySnapshot);
            QRCode.toCanvas(document.getElementById('qrcode'), this.id, {scale: 9});
            return this.contractorService.getContractorById(this.id)
          }))
          .subscribe(contractor => {
            this.justCheckOut = contractor.justCheckOut;
            this.cName = contractor.cFirstName + ' ' + contractor.cLastName
            this.email = contractor.email
            if(this.justCheckOut) {
              this.provideFeedback();
            }
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
      resolve(this.router.url.includes("/contractor/update"));
    })
  }

  toggleQRCode(toggle: boolean) {
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
            this.contractorService.updateDetails(this.id, phone);
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

  provideFeedback() {
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
      if(willProvide.value) {
        this.provideContext();
      }
      else {
        this.contractorService.provideFeedback(this.id, false)
      }
    });
  }

  private provideContext(inputTitle?: string, inputContext?: string) {
    inputTitle = (inputTitle == undefined) ? '' : inputTitle;
    inputContext = (inputContext == undefined)? '' : inputContext;
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
            this.contractorService.provideFeedback(this.id, true, this.cName, this.email, title, context)
          }
          else {
            this.provideFeedback();
          }
        })
      }
      else {
        Swal.fire({
          title: "Error!",
          html: "Please do not leave the fields empty!",
          type: "error"
        })
        .then(() => {
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
