import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { Staff } from 'src/app/classes';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-a-s-view',
  templateUrl: './a-s-view.component.html',
  styleUrls: ['./a-s-view.component.scss']
})
export class A_S_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    @Optional() private pagesNum: number,
    @Optional() private outputStaffs: Staff[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'staff-view']);

    $('span#current-contractors').hide();

    this.validateUserType().then(res => {
      if(res) {
        this.adminService.getStaffs().pipe(
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
      resolve(this.router.url.includes("/admin/staff-view"));
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

  loadComponent(staffs: Staff[]) {
    $('div#pages').empty();

    let staffsNum = staffs.length;
    this.pagesNum = ((staffsNum / 8) == 0) ? 1 : Math.ceil(staffsNum / 8);
    this.outputStaffs = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (staffsNum < 8) ? staffsNum : 8;
      this.outputStaffs[iPage] = new Array(fill);
      for(let iStaff = 0; iStaff < fill; iStaff++) {
        this.outputStaffs[iPage][iStaff] = staffs[0];
        staffs.shift();
        staffsNum--;
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

    const output = this.outputStaffs[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('p#staff-name-'+ i).empty();
    }
    $('td.td-btn > span').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const staff = output[i - 1];
      $('p#staff-name-'+ i).text(staff.sFirstName + " " + staff.sLastName);
      $('tr#item-'+ i +' > td.td-btn > span').show();
      $('tr#item-'+ i +'-btn > td.td-btn > span').show();

      $('p#staff-name-'+ i).click(() => {
        this.clickInfo(staff);
      })
      
      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickUpdate(staff.id);
      });
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickUpdate(staff.id);
      });

      $('tr#item-'+ i +' > td.td-btn-danger > span').click(() => {
        this.clickDelete(staff.id);
      });
      $('tr#item-'+ i +'-btn > td.td-btn-danger > span').click(() => {
        this.clickDelete(staff.id);
      });
    }
  }

  clickInfo(staff: Staff) {
    Swal.fire({
      title: `Staff: ${staff.sFirstName} ${staff.sLastName}`,
      text:
      `Email: ${staff.email}
      Phone: ${staff.phone}
      Role: ${staff.role}`,
      type: 'info'
    });
  }

  clickUpdate(id: string) {
    this.adminService.passUpdateId(id);
    this.router.navigate(['/admin', 'staff-update']);
  }

  clickDelete(id: string) {
    Swal.fire({
      title: "Delete?",
      text: "Are you sure you want to delete this staff?",
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Update",
    })
    .then((willDelete) => {
      if(willDelete.value) {
        this.adminService.deleteStaff(id);
        Swal.fire({
          title: "Success!",
          text: "Staff deleted!",
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
