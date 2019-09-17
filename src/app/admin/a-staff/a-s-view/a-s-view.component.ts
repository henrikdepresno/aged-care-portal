import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { AdminService } from '../../admin.service';
import { StaffView } from '../../../classes-output';
import swal from 'sweetalert';

@Component({
  selector: 'app-a-s-view',
  templateUrl: './a-s-view.component.html',
  styleUrls: ['./a-s-view.component.scss']
})
export class A_S_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService,
    @Optional() private pagesNum: number,
    @Optional() private outputStaffs: StaffView[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'staff-view']);

    const current = this.adminService.getCurrentVisitorNumber();
    $('strong#current-visitors-num').text(current);
    $('strong#current-visitors-num').css("user-select", "none");

    let staffViews = this.adminService.getStaffViews();
    let staffsNum = staffViews.length;
    this.pagesNum = ((staffsNum / 8) == 0) ? 1 : Math.ceil(staffsNum / 8);
    this.outputStaffs = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (staffsNum < 8) ? staffsNum : 8;
      this.outputStaffs[iPage] = new Array(fill);
      for(let iStaff = 0; iStaff < fill; iStaff++) {
        this.outputStaffs[iPage][iStaff] = staffViews[0];
        staffViews.shift();
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
    $('td.td-btn').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const staff = output[i - 1];
      $('p#staff-name-'+ i).text(staff.sFirstName + " " + staff.sLastName);
      $('tr#item-'+ i +' > td.td-btn').show();
      $('tr#item-'+ i +'-btn > td.td-btn').show();
      
      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickUpdate();
      });
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickUpdate();
      });

      $('tr#item-'+ i +' > td.td-btn-danger > span').click(() => {
        this.clickDelete();
      });
      $('tr#item-'+ i +'-btn > td.td-btn-danger > span').click(() => {
        this.clickDelete();
      });
    }
  }

  clickUpdate() {
    this.router.navigate(['/admin', 'staff-update']);
  }

  clickDelete(){
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this staff?",
      icon: "warning",
      dangerMode: true, //sets the focus to cancel button to avoid accidentally delete
      buttons: {
        cancel: "Cancel",
        ok: "Yes"
      }
    } as any)
      .then((willDelete) => {
        if (willDelete) {

          //remove contractor from firebase collection here
          
          swal("Staff deleted!", {
            icon: "success",
          });
        }
      });
  }

}
