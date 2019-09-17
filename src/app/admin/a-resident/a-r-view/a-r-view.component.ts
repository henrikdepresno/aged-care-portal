import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { AdminService } from '../../admin.service';
import { ResidentView } from '../../../classes-output';
import swal from 'sweetalert';

@Component({
  selector: 'app-a-r-view',
  templateUrl: './a-r-view.component.html',
  styleUrls: ['./a-r-view.component.scss']
})
export class A_R_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService,
    @Optional() private pagesNum: number,
    @Optional() private outputResidents: ResidentView[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-view']);

    const current = this.adminService.getCurrentVisitorNumber();
    $('strong#current-visitors-num').text(current);
    $('strong#current-visitors-num').css("user-select", "none");
    
    let residents = this.adminService.getResidents();
    residents.subscribe(res => {
      let residentViews: ResidentView[] = [];
      for(let i = 0; i < res.length; i++) {
        residentViews.push(new ResidentView(res[i].rFirstName, res[i].rLastName));
      }

      $('div#pages').empty();

      let residentsNum = residentViews.length;
      this.pagesNum = ((residentsNum / 8) == 0) ? 1 : Math.ceil(residentsNum / 8);
      this.outputResidents = new Array(this.pagesNum);
      for(let iPage = 0; iPage < this.pagesNum; iPage++) {
        const fill = (residentsNum < 8) ? residentsNum : 8;
        this.outputResidents[iPage] = new Array(fill);
        for(let iRes = 0; iRes < fill; iRes++) {
          this.outputResidents[iPage][iRes] = residentViews[0];
          residentViews.shift();
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

    const output = this.outputResidents[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('p#resident-name-'+ i).empty();
    }
    $('td.td-btn').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const resident = output[i - 1];
      $('p#resident-name-'+ i).text(resident.rFirstName + " " + resident.rLastName);
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
    this.router.navigate(['/admin', 'resident-update']);
  }

  clickDelete(){
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this resident?",
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
          
          swal("Resident deleted!", {
            icon: "success",
          });
        }
      });
  }

}
