import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private visitorService: VisitorService,
    @Optional() private pagesNum: number,
    @Optional() private outputBookings: Booking[][],
    @Optional() private id: string
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'booking-view']);

    this.validateUserType().then(res => {
      if(res) {
        this.visitorService.getAuthState().pipe(
          mergeMap(authState => {
            return this.visitorService.getQuerySnapshotByEmail(authState.email, 'visitor');
          }),
          mergeMap(querySnapshot => {
            this.id = this.visitorService.getIdFromEmailQuerySnapshot(querySnapshot);
            QRCode.toCanvas(document.getElementById('qrcode'), this.id, {scale: 9});
            return this.visitorService.getVisitorById(this.id);
          }),
          mergeMap(visitor => {
            if(visitor.bookingIds.length != 0) {
              return this.visitorService.getBookings(visitor.bookingIds);
            }
            else {
              return of([]);
            }
          }))
          .subscribe(bookings => {
            this.loadComponent(bookings);
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
    
    this.clickPage(1);
  }

  clickPage(page: number) {
    $('span.page').css('background-color', '#E9EBEC');
    $('span#page-'+ page).css('background-color', '#B0B5BA');
  
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
      const bookingDateStr = `${booking.date.substring(6)}-${booking.date.substring(3, 5)}-${booking.date.substring(0, 2)}}`
      const bookingDate = new Date(bookingDateStr)
      let status = "";
      if(!booking.isCancelled) {
        if(today.getFullYear() < bookingDate.getFullYear() ||
        (today.getFullYear() == bookingDate.getFullYear() && today.getMonth() < bookingDate.getMonth()) ||
        (today.getFullYear() == bookingDate.getFullYear() && today.getMonth() == bookingDate.getMonth() && today.getDate() < bookingDate.getDate())) {
          status = "Expired"
        }
        else {
          status = "Confirmed"
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
    swal({
      title: `Booking for: ${booking.rName}`,
      text:
      `Time: ${booking.timeSlots[0]}:00 ${booking.date}
      Status: ${status}`,
      icon: "info",
    });
  }

  clickModify(residentId, bookingId) {
    this.visitorService.passResidentId(residentId);
    this.visitorService.passBookingId(bookingId);
    this.router.navigate(['/visitor', 'booking-modify']);
  }

  clickCancel(id: string) {
    swal({
      title: "Cancel?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: "Cancel",
        ok: "Yes"
      }
    } as any)
    .then((willCancel) => {
      if(willCancel) {
        this.visitorService.cancelBooking(id);
      }
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-v']);
  }

}
