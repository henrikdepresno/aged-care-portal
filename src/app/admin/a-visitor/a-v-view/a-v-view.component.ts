import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { AdminService } from '../../admin.service';
import { VisitorView } from '../../../classes-output';

@Component({
  selector: 'app-a-v-view',
  templateUrl: './a-v-view.component.html',
  styleUrls: ['./a-v-view.component.scss']
})
export class A_V_ViewComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService,
    @Optional() private pagesNum: number,
    @Optional() private outputVisitors: VisitorView[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'visitor-view']);

    const current = this.adminService.getCurrentVisitorNumber();
    $('strong#current-visitors-num').text(current);
    $('strong#current-visitors-num').css("user-select", "none");

    let visitorViews = this.adminService.getVisitorViews();
    let visitorsNum = visitorViews.length;
    this.pagesNum = ((visitorsNum / 8) == 0) ? 1 : Math.ceil(visitorsNum / 8);
    this.outputVisitors = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (visitorsNum < 8) ? visitorsNum : 8;
      this.outputVisitors[iPage] = new Array(fill);
      for(let iVis = 0; iVis < fill; iVis++) {
        this.outputVisitors[iPage][iVis] = visitorViews[0];
        visitorViews.shift();
        visitorsNum--;
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

    const output = this.outputVisitors[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('p#visitor-name-'+ i).empty();
    }
    $('td.td-btn-primary').hide();
    $('td.td-btn-img img').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const visitor = output[i - 1];
      $('p#visitor-name-'+ i).text(visitor.vFirstName + " " + visitor.vLastName);
      $('tr#item-'+ i +' > td.td-btn-primary').show();
      $('tr#item-'+ i +'-btn > td.td-btn-primary').show();

      if(visitor.isFlagged){
        $('tr#item-'+ i +' > td.td-btn-img img').show();
        $('tr#item-'+ i +'-btn > td.td-btn-img img').show();
      }

      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickUpdate();
      });
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickUpdate();
      });
    }
  }

  clickUpdate() {
    this.router.navigate(['/admin', 'visitor-update']);
  }

}
