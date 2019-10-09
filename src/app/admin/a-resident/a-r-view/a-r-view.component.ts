import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { Resident } from 'src/app/classes';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-a-r-view',
  templateUrl: './a-r-view.component.html',
  styleUrls: ['./a-r-view.component.scss']
})
export class A_R_ViewComponent implements OnInit {

  private pagesNum: number;
  private outputResidents: Resident[][];

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-view']);

    $('span#current-contractors').hide();

    this.validateUserType().then(res => {
      if(res) {
        this.adminService.getResidents().pipe(
          mergeMap(res => {
            this.loadComponent(res);
            return this.adminService.getCurrentContractors();
          }),
          mergeMap(cNumSnapshot => {
            $('strong#current-contractors-num').text(cNumSnapshot.size);
            $('strong#current-contractors-num').css("user-select", "none");
            return this.adminService.getCurrentVisitors();
          }))
          .subscribe(vNumSnapshot => {
            $('strong#current-visitors-num').text(vNumSnapshot.size);
            $('strong#current-visitors-num').css("user-select", "none");
          });
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/resident-view"));
    })
  }

  switchCurrentNum(numType: string) {
    if(numType == 'contractors') {
      $('span#current-contractors').show();
      $('span#current-visitors').hide();
    }
    else {
      $('span#current-visitors').show();
      $('span#current-contractors').hide();
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
        this.clickUpdate(resident.id);
      });
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickUpdate(resident.id);
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
      html:
      `Phone: ${resident.phone}`,
      type: 'info'
    });
  }

  clickUpdate(id: string) {
    this.adminService.passUpdateId(id);
    this.router.navigate(['/admin', 'resident-update']);
  }

  clickDelete(id: string) {
    Swal.fire({
      title: "Delete?",
      html: "Are you sure you want to delete this resident?",
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes"
    })
    .then((willDelete) => {
      if(willDelete.value) {
        this.adminService.deleteResident(id);
        Swal.fire({
          title: "Success!",
          html: "Resident deleted!",
          type: 'success'
        })
      }
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-a']);
  }

}
