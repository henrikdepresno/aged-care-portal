import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import QRCode from 'qrcode';
import swal from 'sweetalert';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private contractorService: ContractorService,
    @Optional() private justCheckOut: boolean,
    @Optional() private cName: string,
    @Optional() private email: string
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
            this.contractorService.updateDetails(this.id, phone);
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

  provideFeedback() {
    swal({
      title: "Hi!",
      text: `Since you recently visited our facility,
      do you want to provide feedback about the visit?`,
      icon: "info",
      buttons: {
        cancel: "No",
        ok: "Yes"
      }
    } as any)
    .then((willProvide) => {
      if(willProvide) {
        swal({
          content: {
            element: "input",
            attributes: {
              placeholder: "Feedback Title",
              type: "text",
            },
          },
        })
        .then((title) => {
          swal({
            content: {
              element: "input",
              attributes: {
                placeholder: "Please provide details of your visit",
                type: "text",
              },
            },
          })
          .then((context) => {
            swal({
              text: `Feedback: ${title}
              Details: ${context}`,
              icon: "info",
              buttons: {
                cancel: "Cancel",
                ok: "Submit"
              }
            } as any)
            .then((confirmFeedback) => {
              if(confirmFeedback) {
                this.contractorService.provideFeedback(this.id, true, this.cName, this.email, title, context)
              }
              else {
                this.contractorService.provideFeedback(this.id, false)
              }
            });
          });
        });
      }
      else {
        this.contractorService.provideFeedback(this.id, false)
      }
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-c']);
  }
}
