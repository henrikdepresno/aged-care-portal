import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
import { AuthService } from 'src/app/auth.service';
import { StaffService } from '../staff.service';
import { Feedback } from '../../classes';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-s-feedback',
  templateUrl: './s-feedback.component.html',
  styleUrls: ['./s-feedback.component.scss']
})
export class S_FeedbackComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private staffService: StaffService,
    @Optional() private pagesNum: number,
    @Optional() private outputfeedbacks: Feedback[][]
  ) { }

  ngOnInit() {
    this.router.navigate(['/staff', 'feedback']);

    this.validateUserType().then(res => {
      if(res) { 
        this.staffService.getFeedbacks().pipe(
          mergeMap(res => {
            this.loadComponent(res);
            res = res.reverse();
            return this.staffService.getRatings();
          }),
          mergeMap(res => {
            $('#rating-num-1').text(res.one);
            $('#rating-num-2').text(res.two);
            $('#rating-num-3').text(res.three);
            $('#rating-num-4').text(res.four);
            $('#rating-num-5').text(res.five);
            return this.staffService.getCurrentVisitors();
          }))
          .subscribe(snapshot => {
            let current = snapshot.size;
            $('strong#current-visitors-num').text(current);
            $('strong#current-visitors-num').css("user-select", "none");
          });
      }
    });
  }

  validateUserType() {
    return new Promise((resolve, reject) => {
      this.authService.checkUserType();
      resolve(this.router.url.includes("/staff/feedback"));
    })
  }

  loadComponent(feedbacks: Feedback[]) {
    let feedbacksNum = feedbacks.length;
    this.pagesNum = ((feedbacksNum / 8) == 0) ? 1 : Math.ceil(feedbacksNum / 8);
    this.outputfeedbacks = new Array(this.pagesNum);
    for(let iPage = 0; iPage < this.pagesNum; iPage++) {
      const fill = (feedbacksNum < 8) ? feedbacksNum : 8;
      this.outputfeedbacks[iPage] = new Array(fill);
      for(let iFeed = 0; iFeed < fill; iFeed++) {
        this.outputfeedbacks[iPage][iFeed] = feedbacks[0];
        feedbacks.shift();
        feedbacksNum--;
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

    const output = this.outputfeedbacks[page - 1];
    $('table#item-list-xs > tr.item').hide();
    for(let i = 1; i <= 8; i++) {
      $('td.td-text > p').empty();
    }
    $('td.td-btn > span').hide();
    for(let i = 1; i <= output.length; i++) {
      $('table#item-list-xs > tr#item-'+ i +'-text-1').show();
      $('table#item-list-xs > tr#item-'+ i +'-text-2').show();
      $('table#item-list-xs > tr#item-'+ i +'-text-3').show();
      $('table#item-list-xs > tr#item-'+ i +'-btn').show();
      const feedback = output[i - 1];
      $('p#title-'+ i).text(feedback.title);
      $('p#author-'+ i).text(feedback.author);
      $('p#role-'+ i).text(feedback.role);
      $('p#date-'+ i).text(feedback.date);
      $('tr#item-'+ i +' > td.td-btn > span').show();
      $('tr#item-'+ i +'-btn > td.td-btn > span').show();

      $('tr#item-'+ i +' > td.td-btn > span').click(() => {
        this.clickView(feedback);
      });
      $('tr#item-'+ i +'-btn > td.td-btn > span').click(() => {
        this.clickView(feedback);
      });
    }
  }

  clickView(feedback: Feedback) {
    swal({
      title: feedback.title,
      text:
      `${feedback.context}
      Author: ${feedback.author} - ${feedback.role}
      < ${feedback.authorEmail} >
      Date: ${feedback.date}`,
      icon: "info",
    });
  }

}
