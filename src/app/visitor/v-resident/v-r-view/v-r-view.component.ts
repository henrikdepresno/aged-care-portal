import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import { AuthService } from 'src/app/auth.service';
import { VisitorService } from '../../visitor.service';
import { Resident } from '../../../classes';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-v-r-view',
  templateUrl: './v-r-view.component.html',
  styleUrls: ['./v-r-view.component.scss']
})
export class V_R_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private visitorService: VisitorService,
    @Optional() private pagesNum: number,
    @Optional() private outputResidents: Resident[][],
    @Optional() private id: string,
    @Optional() private justCheckOut: boolean,
    @Optional() private vName: string,
    @Optional() private email: string
  ) { }

  ngOnInit() {
    this.router.navigate(['/visitor', 'resident-view']);

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
            this.justCheckOut = visitor.justCheckOut;
            this.vName = visitor.vFirstName + ' ' + visitor.vLastName
            this.email = visitor.email
            if(visitor.residentIds.length != 0) {
              return this.visitorService.getResidents(visitor.residentIds);
            }
            else {
              return of([])
            }
          }))
          .subscribe(residents => {
            this.loadComponent(residents);
          });
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/visitor/resident-view"));
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

  loadComponent(residents: Resident[]) {
    $('div#pages').empty();

    let residentsNum = residents.length;
    this.pagesNum = ((residentsNum / 8) == 0) ? 1 : Math.ceil(residentsNum / 8);
    this.outputResidents = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (residentsNum < 8) ? residentsNum : 8;
      this.outputResidents[iPage] = new Array(fill);
      for(let iRes = 0; iRes < fill; iRes++) {
        this.outputResidents[iPage][iRes] = residents[0];
        residents.shift();
        residentsNum--;
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
      '-ms-user-select': 'none',
      'user-select': 'none'
    });
    if(this.pagesNum > 7) {
      for(let iPage = 7; iPage < this.pagesNum; iPage++) {
        $('span#page-'+ iPage).hide();
      }
    }
    
    this.clickPage(1);

    if(this.justCheckOut) {
      this.provideFeedback();
    }
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

    const output = this.outputResidents[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('p#resident-name-'+ i).empty();
    }
    $('td.td-btn > span').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const resident = output[i - 1];
      $('p#resident-name-'+ i).text(resident.rFirstName + " " + resident.rLastName);
      $('tr#item-'+ i +' > td.td-btn > span').show();
      $('tr#item-'+ i +'-btn > td.td-btn > span').show();

      $('p#resident-name-'+ i).click(() => {
        this.clickInfo(resident);
      })
      
      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickBook(resident.id);
      });
      
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickBook(resident.id);
      });

      $('tr#item-'+ i +' > td.td-btn-danger > span').click(() => {
        this.clickDelete(resident.id);
      });
      
      $('tr#item-'+ i +'-btn > td.td-btn-danger > span').click(() => {
        this.clickDelete(resident.id);
      });
    }
  }

  clickInfo(resident: Resident) {
    Swal.fire({
      title: `Resident: ${resident.rFirstName} ${resident.rLastName}`,
      text:
      `Phone: ${resident.phone}`,
      type: 'info'
    })
  }

  clickBook(id: string) {
    this.visitorService.passResidentId(id);
    this.router.navigate(['/visitor', 'booking-add']);
  }

  clickDelete(id: string) {
    Swal.fire({
      title: "Delete?",
      text: "Are you sure you want to delete this resident?",
      type: "warning",
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes"
    })
    .then((willDelete) => {
      if(willDelete.value) {
        this.visitorService.deleteResident(this.id, id);
      }
    });
  }

  provideFeedback() {
    Swal.fire({
      title: "Hi!",
      text: `Since you recently visited our facility,
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
        this.visitorService.provideFeedback(this.id, false)
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
          text: `Feedback: ${title}
          Details: ${context}`,
          type: 'info',
          showCancelButton: true,
          reverseButtons: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Submit Feedback"
        })
        .then((confirmFeedback) => {
          if(confirmFeedback.value) {
            this.visitorService.provideFeedback(this.id, true, this.vName, this.email, title, context)
          }
          else {
            this.provideFeedback();
          }
        })
      }
      else {
        Swal.fire({
          title: "Error!",
          text: "Please do not leave the fields empty!",
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
    this.router.navigate(['/login', 'login-v']);
  }

}
