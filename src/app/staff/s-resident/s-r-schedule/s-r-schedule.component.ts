import { Component, OnInit, Optional } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { StaffService } from '../../staff.service';
import { WeeklySchedules } from '../../../classes-output';

@Component({
  selector: 'app-s-r-schedule',
  templateUrl: './s-r-schedule.component.html',
  styleUrls: ['./s-r-schedule.component.scss']
})
export class S_R_ScheduleComponent implements OnInit {

  constructor(
    private router: Router,
    private staffService: StaffService,
    @Optional() private initialClick: boolean,
    @Optional() private weeklySchedules: WeeklySchedules,
    @Optional() private today: Date
  ) { }

  jB = "section#list-booking ";
  jW = "section#list-weekly ";

  ngOnInit() {
    this.router.navigate(['/staff', 'resident-schedule']);

    const current = this.staffService.getCurrentVisitorNumber();
    $('strong#current-visitors-num').text(current);
    $('strong#current-visitors-num').css("user-select", "none");

    $('div#switch-booking').click(() => {
      $('section#list-weekly').hide();
      $('section#list-booking').show();
    })
    $('div#switch-weekly').click(() => {
      $('section#list-booking').hide();
      $('section#list-weekly').show();
    })

    this.weeklySchedules = this.staffService.getWeeklySchedules();
    $(this.jB + ' div#list-main > h1').text("MAKE A BOOKING: " + this.weeklySchedules.rFirstName + " " + this.weeklySchedules.rLastName);
    $(this.jW + ' div#list-main > h1').text("WEEKLY SCHEDULE: " + this.weeklySchedules.rFirstName + " " + this.weeklySchedules.rLastName);

    this.loadWeeklySchedule();

    this.initialClick = true;
    this.today = new Date();

    this.datePicker(this.today);
    $('span#calendar-icon').click(() => {
      $('div#dp').show();
    });

    $('div#dp-close').click(() => {
        $('div#dp').hide();
    });
  }

  datePicker(date: Date) {
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    $('span#dp-prev').click(() => {
      const prevMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      this.datePicker(prevMonth);
    });
    $('span#dp-next').click(() => {
      const nextMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.datePicker(nextMonth);
    });
    $('table#dp-body td').text("");
    const daysBefore = firstDate.getDay();
    const month = firstDate.getMonth();
    const year = firstDate.getFullYear();
    if(this.initialClick){
      this.selectDate(date);
      $(this.jB + 'p.p-date').text(
        ((date.getDate() < 10) ? "0" + date.getDate() : date.getDate())  + "/" +
        ((month + 1 < 10) ? "0" + (month + 1) : month + 1) + "/" +
        year);
      this.initialClick = false;
    }
    let daysNum = 0;
    switch(month){
      case 0: $('span#dp-my').text("January " + year); daysNum = 31; break;
      case 1: $('span#dp-my').text("Febuary " + year);
        if(year % 4 == 0) {
          if(year % 100 == 0) {
            if(year % 400 == 0) {
              daysNum = 29;
            } else { daysNum = 28; }
          } else { daysNum = 29; }
        } else { daysNum = 28; }
        break;
      case 2: $('span#dp-my').text("March " + year); daysNum = 31; break;
      case 3: $('span#dp-my').text("April " + year); daysNum = 30; break;
      case 4: $('span#dp-my').text("May " + year); daysNum = 31; break;
      case 5: $('span#dp-my').text("June " + year); daysNum = 30; break;
      case 6: $('span#dp-my').text("July " + year); daysNum = 31; break;
      case 7: $('span#dp-my').text("August " + year); daysNum = 31; break;
      case 8: $('span#dp-my').text("September " + year); daysNum = 30; break;
      case 9: $('span#dp-my').text("October " + year); daysNum = 31; break;
      case 10: $('span#dp-my').text("November " + year); daysNum = 30; break;
      default: $('span#dp-my').text("December " + year); daysNum = 31; break;
    }
    let cellInRow = 0;
    let rowIndex = 1;
    for(let i = 0; i < daysBefore; i++) {
      cellInRow++;
    }
    for(let i = 1; i <= daysNum; i++) {
      if(cellInRow >= 7){
        cellInRow = 0;
        rowIndex++;
      }
      $('tr#dp-row-' + rowIndex + '> td:eq('+ cellInRow +')').off('click');
      const outputDate = new Date(year, month, i);
      if(this.today.getFullYear() < outputDate.getFullYear() ||
        (this.today.getFullYear() == outputDate.getFullYear() && this.today.getMonth() < outputDate.getMonth()) ||
        (this.today.getFullYear() == outputDate.getFullYear() && this.today.getMonth() == outputDate.getMonth() && this.today.getDate() <= outputDate.getDate())) {
        $('tr#dp-row-' + rowIndex + '> td:eq('+ cellInRow +')').text(i);
        $('tr#dp-row-' + rowIndex + '> td:eq('+ cellInRow +')').click(() => {
          this.selectDate(outputDate);
          $(this.jB + 'p.p-date').text(
            ((i < 10) ? "0" + i : i)  + "/" +
            ((month + 1 < 10) ? "0" + (month + 1) : month + 1) + "/" +
            year);
          $('div#dp').hide();
        });
      } else {
        $('tr#dp-row-' + rowIndex + '> td:eq('+ cellInRow +')').text("");
      }
      cellInRow++;
    }

    //Calendar styling
    $("table#dp-body td").css({
      "padding": "5px",
      "border": "none",
      "cursor": "pointer",
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      'user-select': 'none'
    });
  }

  selectDate(date: Date){
    const daySchedule = this.weeklySchedules.schedules[date.getDay()];
    for(let i = 7; i <= 22; i++) {
      if(daySchedule[i - 7].hour == i){
        if(daySchedule[i - 7].available){
          $(this.jB + 'p#task-'+ i).text("Available");
          $(this.jB + 'div#task-div-'+ i +" > span").css({
            'background-color': '#C4DBB3',
            'cursor': 'pointer'
          });
        }
        else {
          $(this.jB + 'p#task-'+ i).text(daySchedule[i - 7].activity);
          $(this.jB + 'div#task-div-'+ i +" > span").css({
            'background-color': '#EDAAAA',
            'cursor': 'not-allowed'
          });
        }
      }
    }
  }

  loadWeeklySchedule() {
    for(let i = 0; i <= 6; i++) {
      $('p#p-day-' + i).click(() => {
        this.selectDay(i);
      });
    }
    this.selectDay(0);
  }

  selectDay(day: number){
    const daySchedule = this.weeklySchedules.schedules[day];
    for(let i = 7; i <= 22; i++) {
      if(daySchedule[i - 7].hour == i){
        if(daySchedule[i - 7].available){
          $(this.jW + 'p#task-'+ i).text("Available");
          $(this.jW + 'div#task-div-'+ i +" > span").css({
            'background-color': '#C4DBB3',
            'cursor': 'pointer'
          });
        }
        else {
          $(this.jW + 'p#task-'+ i).text(daySchedule[i - 7].activity);
          $(this.jW + 'div#task-div-'+ i +" > span").css({
            'background-color': '#EDAAAA',
            'cursor': 'pointer'
          });
        }
      }
    }
    $('p.p-day').css({
      '-webkit-box-shadow': '0px 0px 0px 0px',
      '-moz-box-shadow': '0px 0px 0px 0px',
      'box-shadow': '0px 0px 0px 0px',
    });
    $('p#p-day-' + day).css({
      '-webkit-box-shadow': '0px -5px 0px 0px #7B8188 inset',
      '-moz-box-shadow': '0px -5px 0px 0px #7B8188 inset',
      'box-shadow': '0px -5px 0px 0px #7B8188 inset',
    });
  }

}
