import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { Contractor } from 'src/app/classes';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-a-c-view',
  templateUrl: './a-c-view.component.html',
  styleUrls: ['./a-c-view.component.scss']
})
export class A_C_ViewComponent implements OnInit {

  private pagesNum: number;
  private outputContractors: Contractor[][];

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-view']);

    $('span#current-contractors').hide();

    this.validateUserType().then(res => {
      if(res) {
        this.adminService.getContractors().pipe(
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
      resolve(this.router.url.includes("/admin/contractor-view"));
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

  loadComponent(contractors: Contractor[]) {
    $('div#pages').empty();

    let contractorsNum = contractors.length;
    this.pagesNum = ((contractorsNum / 8) == 0) ? 1 : Math.ceil(contractorsNum / 8);
    this.outputContractors = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (contractorsNum < 8) ? contractorsNum : 8;
      this.outputContractors[iPage] = new Array(fill);
      for(let iCon = 0; iCon < fill; iCon++) {
        this.outputContractors[iPage][iCon] = contractors[0];
        contractors.shift();
        contractorsNum--;
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

    const output = this.outputContractors[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('p#contractor-name-'+ i).empty();
    }
    $('td.td-btn > span').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const contractor = output[i - 1];
      $('p#contractor-name-'+ i).text(contractor.cFirstName + " " + contractor.cLastName);
      $('tr#item-'+ i +' > td.td-btn > span').show();
      $('tr#item-'+ i +'-btn > td.td-btn > span').show();

      $('p#contractor-name-'+ i).click(() => {
        this.clickInfo(contractor);
      })

      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickUpdate(contractor.id);
      });
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickUpdate(contractor.id);
      });

      $('tr#item-'+ i +' > td.td-btn-danger > span').click(() => {
        this.clickDelete(contractor.id);
      });
      $('tr#item-'+ i +'-btn > td.td-btn-danger > span').click(() => {
        this.clickDelete(contractor.id);
      });
    }
  }

  clickInfo(contractor: Contractor) {
    Swal.fire({
      title: `Contractor: ${contractor.cFirstName} ${contractor.cLastName}`,
      html:
      `Email: ${contractor.email}<br>
      Phone: ${contractor.phone}<br>
      Company Name: ${contractor.companyName}<br>
      Field: ${contractor.field}`,
      type: "info"
    })
  }

  clickUpdate(id: string) {
    this.adminService.passUpdateId(id);
    this.router.navigate(['/admin', 'contractor-update']);
  }

  clickDelete(id: string) {
    Swal.fire({
      title: "Delete?",
      html: "Are you sure you want to delete this contractor?",
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes",
    })
    .then((willDelete) => {
      if(willDelete.value) {
        this.adminService.deleteContractor(id);
        Swal.fire({
          title: "Success!",
          html: "Contractor deleted!",
          type: 'success'
        })
      }
    })
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-a']);
  }

}
