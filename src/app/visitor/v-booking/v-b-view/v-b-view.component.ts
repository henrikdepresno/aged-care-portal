import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { VisitorService } from '../../visitor.service';
import { BookingView } from '../../../classes-output';
import QRCode from 'qrcode';
import swal from 'sweetalert';

@Component({
  selector: 'app-v-b-view',
  templateUrl: './v-b-view.component.html',
  styleUrls: ['./v-b-view.component.scss']
})
export class V_B_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private visitorService: VisitorService,
    @Optional() private pagesNum: number,
    @Optional() private outputBookings: BookingView[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'booking-view']);
    
    QRCode.toCanvas(document.getElementById('qrcode'), this.visitorService.getVisitorId(), {scale: 9});

    let bookingViews = this.visitorService.getBookingViews();
    let booksNum = bookingViews.length;
    this.pagesNum = ((booksNum / 8) == 0) ? 1 : Math.ceil(booksNum / 8);
    this.outputBookings = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (booksNum < 8) ? booksNum : 8;
      this.outputBookings[iPage] = new Array(fill);
      for(let iBook = 0; iBook < fill; iBook++) {
        this.outputBookings[iPage][iBook] = bookingViews[0];
        bookingViews.shift();
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
      $('strong#booking-status-'+ i).text(booking.status + ":");
      if(booking.status == "Confirmed") {
        $('strong#booking-status-'+ i).css('color','#9ACA74');
      } else if(booking.status == "Cancelled") {
        $('strong#booking-status-'+ i).css('color','#E17272');
      } else {
        $('strong#booking-status-'+ i).css('color','#525E85');
      }
      const time = booking.time;
      const timeStr = (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + ":"
        + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + " "
        + (time.getDate() < 10 ? "0" + time.getDate() : time.getDate()) + "/"
        + (time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1) + "/"
        + time.getFullYear();
      $('p#booking-details-'+ i).text(booking.rFirstName + " | " + timeStr);

      if(booking.status == "Confirmed"){
        $('tr#item-'+ i +' > td.td-btn > span').show();
        $('tr#item-'+ i +'-btn > td.td-btn > span').show();
      }


      //jQuery for buttons. This will loop depending on how many bookings found in the database
      // for now the buttons hardcoded per row of confirmed bookings
      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickModify();
      });
      
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickModify();
      });

      //Henrik: added clickDelete function
      $('tr#item-'+ i +' > td.td-btn-danger > span').click(() => {
        this.clickDelete();
      });
      
      $('tr#item-'+ i +'-btn > td.td-btn-danger > span').click(() => {
        this.clickDelete();
      });
    }

  }

  clickModify() {
    this.router.navigate(['/visitor', 'booking-modify']);
  }

  //Henrik: added following function
  clickDelete() {
    swal({
      title: "Delete?",
      text: "Are you sure to delete this booking?",
      icon: "warning",
      dangerMode: true, //sets the focus to cancel button to avoid accidentally delete
      buttons: {
        cancel: "Cancel",
        ok: "Yes"
      }
    } as any)
      .then((willDelete) => {
        if (willDelete) {

          //remove from firebase collection here
          
          swal("Booking deleted!", {
            icon: "success",
          });
        }
      });
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

}
