import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { Contractor } from 'src/app/classes';

@Component({
  selector: 'app-a-c-view',
  templateUrl: './a-c-view.component.html',
  styleUrls: ['./a-c-view.component.scss']
})
export class A_C_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    @Optional() private pagesNum: number,
    @Optional() private outputContractors: Contractor[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-view']);

    this.validateUserType().then(res => {
      if(res) { 
        this.loadComponent();
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/contractor-view"));
    })
  }

  loadComponent() {
    const current = this.adminService.getCurrentVisitorNumber();
    $('strong#current-visitors-num').text(current);
    $('strong#current-visitors-num').css("user-select", "none");

    let contractors = this.adminService.getContractors();
    contractors.subscribe(res => {
      $('div#pages').empty();

      let contractorsNum = res.length;
      this.pagesNum = ((contractorsNum / 8) == 0) ? 1 : Math.ceil(contractorsNum / 8);
      this.outputContractors = new Array(this.pagesNum);
      for(let iPage = 0; iPage < this.pagesNum; iPage++) {
        const fill = (contractorsNum < 8) ? contractorsNum : 8;
        this.outputContractors[iPage] = new Array(fill);
        for(let iCon = 0; iCon < fill; iCon++) {
          this.outputContractors[iPage][iCon] = res[0];
          res.shift();
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
    });
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
    $('td.td-btn').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const contractor = output[i - 1];
      $('p#contractor-name-'+ i).text(contractor.cFirstName + " " + contractor.cLastName);
      $('tr#item-'+ i +' > td.td-btn').show();
      $('tr#item-'+ i +'-btn > td.td-btn').show();

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
    swal({
      title: `Contractor: ${contractor.cFirstName} ${contractor.cLastName}`,
      text:
      `Email: ${contractor.email}
      Phone: ${contractor.phone}
      Company Name: ${contractor.companyName}
      Field: ${contractor.field}`,
      icon: "info",
    });
  }

  clickUpdate(id: string) {
    this.adminService.passUpdateId(id);
    this.router.navigate(['/admin', 'contractor-update']);
  }

  clickDelete(id: string) {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this contractor?",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: "Cancel",
        ok: "Yes"
      }
    } as any)
    .then((willDelete) => {
      if(willDelete) {
        this.adminService.deleteContractor(id);
        swal("Contractor deleted!", {
          icon: "success",
        })
      }
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-a']);
  }

}
