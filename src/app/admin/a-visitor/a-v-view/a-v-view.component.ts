import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { Visitor } from 'src/app/classes';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-a-v-view',
  templateUrl: './a-v-view.component.html',
  styleUrls: ['./a-v-view.component.scss']
})
export class A_V_ViewComponent implements OnInit {

  // Predefined properties
  private pagesNum: number;
  private outputVisitors: Visitor[][];

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'visitor-view']);

    $('span#current-contractors').hide();

    this.validateUserType().then(res => {
      if(res) {
        this.adminService.getVisitors().pipe(
          mergeMap(res => {
            // Load the component with provided contractors
            this.loadComponent(res);
            return this.adminService.getCurrentContractors();
          }),
          mergeMap(cNumSnapshot => {
            // Get number of current contractors
            $('strong#current-contractors-num').text(cNumSnapshot.size);
            $('strong#current-contractors-num').css("user-select", "none");
            return this.adminService.getCurrentVisitors();
          }))
          .subscribe(vNumSnapshot => {
            // Get number of current visitors
            $('strong#current-visitors-num').text(vNumSnapshot.size);
            $('strong#current-visitors-num').css("user-select", "none");
          });
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/admin/visitor-view"));
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

  loadComponent(visitors: Visitor[]) {
    $('div#pages').empty();

    // Place provided visitors into paged sections
    let visitorsNum = visitors.length;
    this.pagesNum = ((visitorsNum / 8) == 0) ? 1 : Math.ceil(visitorsNum / 8);
    this.outputVisitors = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (visitorsNum < 8) ? visitorsNum : 8;
      this.outputVisitors[iPage] = new Array(fill);
      for(let iVis = 0; iVis < fill; iVis++) {
        this.outputVisitors[iPage][iVis] = visitors[0];
        visitors.shift();
        visitorsNum--;
      }
    }

    // Pagination
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
    
    // Initial click on first page
    this.clickPage(1);
  }

  clickPage(page: number) {
    $('span.page').css('background-color', '#E9EBEC');
    $('span#page-'+ page).css('background-color', '#B0B5BA');
  
    // First and last page number will always at the two ends
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

    // Print out basic info and show the buttons only if there is a visitor exist in a particular paged section
    const output = this.outputVisitors[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('p#visitor-name-'+ i).empty();
    }
    $('td.td-btn-primary > span').hide();
    $('td.td-btn-img > span').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const visitor = output[i - 1];
      $('p#visitor-name-'+ i).text(visitor.vFirstName + " " + visitor.vLastName);
      $('tr#item-'+ i +' > td.td-btn-primary > span').show();
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').show();

      $('p#visitor-name-'+ i).click(() => {
        this.clickInfo(visitor);
      })

      if(visitor.flags.length != 0){
        $('tr#item-'+ i +' > td.td-btn-img > span').show();
        $('tr#item-'+ i +'-btn > td.td-btn-img > span').show();
        $('tr#item-'+ i +' > td.td-btn-img > span').click(() => {
          this.clickInfo(visitor);
        })
        $('tr#item-'+ i +'-btn > td.td-btn-img > span').click(() => {
          this.clickInfo(visitor);
        })
      }

      $('tr#item-'+ i +' > td.td-btn-primary > span').click(() => {
        this.clickUpdate(visitor.id);
      });
      $('tr#item-'+ i +'-btn > td.td-btn-primary > span').click(() => {
        this.clickUpdate(visitor.id);
      });
    }
  }

  clickInfo(visitor: Visitor) {
    // Return an info alert with details info
    Swal.fire({
      title: `Visitor: ${visitor.vFirstName} ${visitor.vLastName}`,
      html:
      `Email: ${visitor.email}<br>
      Phone: ${visitor.phone}<br>
      Flagged: ${(visitor.flags.length != 0) ? "Yes" : "No"}`,
      type: 'info'
    })
  }

  clickUpdate(id: string) {
    // Pass the visitor's ID to visitor-update component
    this.adminService.passUpdateId(id);
    this.router.navigate(['/admin', 'visitor-update']);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login', 'login-a']);
  }

}
