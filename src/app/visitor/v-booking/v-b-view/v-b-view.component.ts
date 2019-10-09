import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import { AuthService } from 'src/app/auth.service';
import { VisitorService } from '../../visitor.service';
import { Booking } from '../../../classes';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs'

@Component({
  selector: 'app-v-b-view',
  templateUrl: './v-b-view.component.html',
  styleUrls: ['./v-b-view.component.scss']
})
export class V_B_ViewComponent implements OnInit {

  // Predefined properties
  private pagesNum: number;
  private outputBookings: Booking[][];
  private id: string;
  private justCheckOut: boolean;
  private vName: string;
  private email: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private visitorService: VisitorService
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'booking-view']);

    this.validateUserType().then(res => {
      if(res) {
        this.visitorService.getAuthState().pipe(
          mergeMap(authState => {
            // Get query snapshot to get logged visitor ID
            return this.visitorService.getQuerySnapshotByEmail(authState.email, 'visitor');
          }),
          mergeMap(querySnapshot => {
            // Get the logged visitor ID
            this.id = this.visitorService.getIdFromEmailQuerySnapshot(querySnapshot);
            // Generate QR code to canvas
            QRCode.toCanvas(document.getElementById('qrcode'), this.id, {scale: 9});
            return this.visitorService.getVisitorById(this.id);
          }),
          mergeMap(visitor => {
            // Get certain info from visitor to ask for feedback
            this.justCheckOut = visitor.justCheckOut;
            this.vName = visitor.vFirstName + ' ' + visitor.vLastName
            this.email = visitor.email
            if(visitor.bookingIds.length != 0) {
              return this.visitorService.getBookings(visitor.bookingIds);
            }
            else { // Prevent 'undefined' instead of an empty array
              return of([]);
            }
          }))
          .subscribe(bookings => {
            // Load the component with provided bookings
            this.loadComponent(bookings);
            if(this.justCheckOut) {
              this.provideFeedback();
            }
          });
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/visitor/booking-view"));
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

  loadComponent(bookings: Booking[]) {
    $('div#pages').empty();

    // Place provided bookings into paged sections
    let booksNum = bookings.length;
    this.pagesNum = ((booksNum / 8) == 0) ? 1 : Math.ceil(booksNum / 8);
    this.outputBookings = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (booksNum < 8) ? booksNum : 8;
      this.outputBookings[iPage] = new Array(fill);
      for(let iBook = 0; iBook < fill; iBook++) {
        this.outputBookings[iPage][iBook] = bookings[0];
        bookings.shift();
        booksNum--;
      }
    }

    // Pagination
    for(let iPage = 1; iPage <= this.pagesNum; iPage++) {
      $('div#pages').append('<span id="page-'+ iPage +'" class="page"><p>'+ iPage +'</p></span>');
      $('#page-'+ iPage).click(() => {
        this.clickPage(iPage);
      });
    }
    $('span.page').css({
      'display': 'inline-block',
      'width': '30px',
      'height': '30px',
      'border-radius': '50%',
      'background-color': '#E9EBEC',
      'margin': '5px',
      'cursor': 'pointer'
    });
    $('span.page > p').css({
      'color': '#313B45',
      'font-size': '15px',
      'font-weight': '400',
      'text-transform': 'uppercase',
      'margin': '5px',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      'user-select': 'none'
    });
    if(this.pagesNum > 7) {
      for(let iPage = 7; iPage < this.pagesNum; iPage++) {
        $('span#page-'+ iPage).hide();
      }
    }
    
    // Initial click on first page
    this.clickPage(1);
  }

  clickPage(page: number) {
    $('span.page').css('background-color', '#E9EBEC');
    $('span#page-'+ page).css('background-color', '#B0B5BA');
  
    // First and last page number will always at the two ends
    if(this.pagesNum > 7) {
      for(let iPage = 2; iPage < this.pagesNum; iPage++) {
        $('span#page-'+ iPage).hide();
      }

      if(page <= 4){
        for(let iPage = 2; iPage <= 6; iPage++) {
          $('span#page-'+ iPage).show();
        }
      }
      else if(page >= (this.pagesNum - 3)) {
        for(let iPage = this.pagesNum - 5; iPage < this.pagesNum; iPage++) {
          $('span#page-'+ iPage).show();
        }
      }
      else {
        for(let iPage = page - 2; iPage <= page + 2; iPage++) {
          $('span#page-'+ iPage).show();
        }
      }
    }

    // Print out basic info and show the buttons only if there is a booking exist in a particular paged section
    const output = this.outputBookings[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('strong#booking-status-'+ i).empty();
      $('p#booking-details-'+ i).empty();
    }
    $('td.td-btn > span').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const booking = output[i - 1];
      const today = new Date();
      const bookingDateStr = `${booking.date.substring(6)}-${booking.date.substring(3, 5)}-${booking.date.substring(0, 2)}`
      const bookingDate = new Date(bookingDateStr)
      let status = "";
      if(!booking.isCancelled) {
        if(today.getFullYear() < bookingDate.getFullYear() ||
        (today.getFullYear() == bookingDate.getFullYear() && today.getMonth() < bookingDate.getMonth()) ||
        (today.getFullYear() == bookingDate.getFullYear() && today.getMonth() == bookingDate.getMonth() && today.getDate() <= bookingDate.getDate())) {
          status = "Confirmed"
        }
        else {
          status = "Expired"
        }
      }
      else {
        status = "Cancelled"
      }
      $('strong#booking-status-'+ i).text(status + ":");
      if(status == "Confirmed") {
        $('strong#booking-status-'+ i).css('color','#9ACA74');
      } else if(status == "Cancelled") {
        $('strong#booking-status-'+ i).css('color','#E17272');
      } else {
        $('strong#booking-status-'+ i).css('color','#525E85');
      }
      const time = `${booking.timeSlots[0]}:00 ${booking.date}`;
      $('p#booking-details-'+ i).text(booking.rName + " | " + time);
      if(status == "Confirmed"){
        $('tr#item-'+ i +' > td.td-btn > span').show();
        $('tr#item-'+ i +'-btn > td.td-btn > span').show();
      }

      $('p#booking-details-'+ i).click(() => {
        this.clickInfo(booking, status);
      })

      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickModify(booking.residentId, booking.id);
      });
      
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickModify(booking.residentId, booking.id);
      });

      $('tr#item-'+ i +' > td.td-btn-danger > span').click(() => {
        this.clickCancel(booking.id);
      });
      
      $('tr#item-'+ i +'-btn > td.td-btn-danger > span').click(() => {
        this.clickCancel(booking.id);
      });
    }
  }

  clickInfo(booking: Booking, status: string) {
    // Return an info alert with details info
    Swal.fire({
      title: `Booking for: ${booking.rName}`,
      html: `Time: ${booking.timeSlots[0]}:00 ${booking.date}<br>
      Status: ${status}`,
      type: 'info'
    })
  }

  clickModify(residentId, bookingId) {
    // Pass the resident's ID and booking's ID to booking-modify component
    this.visitorService.passResidentId(residentId);
    this.visitorService.passBookingId(bookingId);
    this.router.navigate(['/visitor', 'booking-modify']);
  }

  clickCancel(id: string) {
    // Return a confirmation alert
    Swal.fire({
      title: "Cancel?",
      html: "Are you sure you want to cancel this booking?",
      type: "warning",
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes"
    })
    .then((willCancel) => {
      if(willCancel.value) {
        this.visitorService.cancelBooking(id);
      }
    })
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
        this.visitorService.provideFeedback(this.id, false)
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
            this.visitorService.provideFeedback(this.id, true, this.vName, this.email, title, context)
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
    this.router.navigate(['/login', 'login-v']);
  }

}
