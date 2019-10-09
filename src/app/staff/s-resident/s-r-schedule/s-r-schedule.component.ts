import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth.service';
import { StaffService } from '../../staff.service';
import { WeeklySchedules } from '../../../classes';
import { mergeMap } from 'rxjs/operators';
import { arrayConsecutive, sortNumArray } from 'src/app/functions';

@Component({
  selector: 'app-s-r-schedule',
  templateUrl: './s-r-schedule.component.html',
  styleUrls: ['./s-r-schedule.component.scss']
})
export class S_R_ScheduleComponent implements OnInit {

  // The selected resident ID
  id: string;

  // Section's ids for jQuery selectors
  jB = "section#list-booking ";
  jW = "section#list-weekly ";
  
  // Predefined properties
  private initialClick: boolean;
  private weeklySchedules: WeeklySchedules;
  private today: Date;
  private selectedSlots: number[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private staffService: StaffService
  ) { }

  ngOnInit() {
    this.router.navigate(['/staff', 'resident-schedule']);

    $('span#current-contractors').hide();

    this.validateUserType().then(res => {
      if(res) {
        this.staffService.residentId.pipe(
          mergeMap(id => {
            // Get the passed resident ID
            this.id = id;
            return this.staffService.getResident(this.id);
          }),
          mergeMap(resident => {
            // Convert resident's schedule
            const rName = resident.rFirstName + " " + resident.rLastName;
            this.weeklySchedules = this.staffService.convertWeeklySchedule(rName, resident.schedule);
            this.loadComponent();
            return this.staffService.getCurrentContractors();
          }),
          mergeMap(cNumSnapshot => {
            // Get number of current contractors
            $('strong#current-contractors-num').text(cNumSnapshot.size);
            $('strong#current-contractors-num').css("user-select", "none");
            return this.staffService.getCurrentVisitors();
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
      resolve(this.router.url.includes("/staff/resident-schedule"));
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

  loadComponent() {
    $(this.jB + ' div#list-main > h1').text("MAKE A BOOKING: " + this.weeklySchedules.rName);
    $(this.jW + ' div#list-main > h1').text("WEEKLY SCHEDULE: " + this.weeklySchedules.rName);

    this.loadWeeklySchedule();

    // Initialize default values
    this.selectedSlots = [];
    this.initialClick = true;
    this.today = new Date();

    // Create a date picker (Calender to select date)
    this.datePicker(this.today);
    $('span#calendar-icon').click(() => {
      $('div#dp').show();
    });

    $('div#dp-close').click(() => {
        $('div#dp').hide();
    });
  }

  // Switch between weekly schedule and booking selection section
  switchSection(section: string) {
    if(section == "booking") {
      $('section#list-weekly').hide();
      $('section#list-booking').show();
    }
    else {
      $('section#list-booking').hide();
      $('section#list-weekly').show();
      for(let i = 0; i < 7; i++) {
        let day = ""
        switch(i) {
          case 0: day = "Sun"; break;
          case 1: day = "Mon"; break;
          case 2: day = "Tue"; break;
          case 3: day = "Wed"; break;
          case 4: day = "Thu"; break;
          case 5: day = "Fri"; break;
          default: day = "Sat"; break;
        }
        $(this.jW + 'p#p-day-' + i).text(day);
      }
    }
  }

  // Custom date picker generation
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

    // Calendar styling
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
    this.selectedSlots = [];
    const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
      + date.getFullYear();
    this.staffService.getBookingsByDate(this.id, dateStr).toPromise()
    .then((snapshot) => {
      const bookedSlots = this.staffService.getBookedSlots(snapshot);
      const daySchedule = this.weeklySchedules.schedules[date.getDay()];
      for(let i = 7; i <= 22; i++) {
        if(daySchedule[i - 7].hour == i){
          $(this.jB + 'div#task-div-'+ i +" > span").off('click');
          // If slot is already been booked
          if(bookedSlots.includes(i)) {
            $(this.jB + 'p#task-'+ i).text("Meeting booked");
            $(this.jB + 'div#task-div-'+ i +" > span").css({
              'background-color': '#EDAAAA',
              'cursor': 'not-allowed'
            });
          }
          // If slot is not available
          else if(!daySchedule[i - 7].available){
            $(this.jB + 'p#task-'+ i).text(daySchedule[i - 7].activity);
            $(this.jB + 'div#task-div-'+ i +" > span").css({
              'background-color': '#EDAAAA',
              'cursor': 'not-allowed'
            });
          }
          // If slot is available
          else {
            $(this.jB + 'p#task-'+ i).text("Available");
            $(this.jB + 'div#task-div-'+ i +" > span").css({
              'background-color': '#C4DBB3',
              'cursor': 'pointer'
            });
            $(this.jB + 'div#task-div-'+ i +" > span").click(() => {
              this.selectSlot(i);
            });
          }
        }
      }
    })
  }

  selectSlot(hour: number) {
    if(this.selectedSlots.includes(hour)) { // If remove an already selected slot
      if(arrayConsecutive(this.selectedSlots, hour, false)) {
        $(this.jB + 'p#task-'+ hour).text("Available");
        $(this.jB + 'div#task-div-'+ hour +" > span").css({
          'background-color': '#C4DBB3',
          'cursor': 'pointer'
        });
        this.selectedSlots = this.selectedSlots.filter((value) => {return value != hour});
      }
      else { // Return an alert if the selected time slots are not consecutive to each other
        Swal.fire({
          title: "Error!",
          html: "Time slots must be next to each other!",
          type: 'error'
        })
      }
    }
    else { // If select a new slot to add in
      if(arrayConsecutive(this.selectedSlots, hour, true)) {
        $(this.jB + 'p#task-'+ hour).text("Selected");
        $(this.jB + 'div#task-div-'+ hour +" > span").css({
          'background-color': '#9BCCE7',
          'cursor': 'pointer'
        });
        this.selectedSlots.push(hour);
        sortNumArray(this.selectedSlots);
      }
      else { // Return an alert if the selected time slots are not consecutive to each other
        Swal.fire({
          title: "Error!",
          html: "Time slots must be next to each other!",
          type: 'error'
        })
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
        $(this.jW + 'div#task-div-'+ i +" > span").off('click');
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
        $(this.jW + 'div#task-div-'+ i +" > span").click(() => {
          this.makeChanges(day, i, daySchedule[i - 7].activity);
        });
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

  addNewBooking() {
    const dateStr = $(this.jB + 'p.p-date').text();
    if(this.selectedSlots.length != 0) {
      // Return a confirmation alert
      Swal.fire({
        title: "Add?",
        html: `Are you sure you want to add this booking?<br>
        Visiting time: ${this.selectedSlots[0]}:00 ${dateStr}`,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes"
      })
      .then((willAdd) => {
        if(willAdd.value) {
          this.staffService.addBooking(this.id, this.weeklySchedules.rName, dateStr, this.selectedSlots);
        }
      })
    }
    else { // Return an alert if no time slots are selected
      Swal.fire({
        title: "Error!",
        html: "Please select at least one booking slot!",
        type: 'error'
      })
    }
  }

  makeChanges(day: number, hour: number, oldActivity: string){
    let dayStr = "";
    switch(day) {
      case 0: dayStr = "Sunday"; break;
      case 1: dayStr = "Monday"; break;
      case 2: dayStr = "Tuesday"; break;
      case 3: dayStr = "Wednesday"; break;
      case 4: dayStr = "Thursday"; break;
      case 5: dayStr = "Friday"; break;
      case 6: dayStr = "Saturday"; break;
    }
    // Return a text field alert: activity
    Swal.fire({
      title: `Change activity on ${dayStr} at ${hour}:00`,
      html:
      `(Leave the field empty or type "Available"<br>
      if you want to make the slot vacant)`,
      input: 'text',
      inputPlaceholder: 'Activity'
    })
    .then((inputActivity) => {
      // If input value is 'activity' or empty, convert it to 'Available'
      const activity = (inputActivity.value == "") ? "Available" : inputActivity.value.charAt(0).toUpperCase() + inputActivity.value.toLowerCase().slice(1);
      // Return a confirmation alert
      Swal.fire({
        title: "Make changes?",
        html: `${oldActivity} → ${activity}<br>
        on ${dayStr} at ${hour}:00?`,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Change"
      })
      .then((willChange) => {
        if(willChange.value) {
          this.staffService.makeScheduleChange(this.id, activity, day, hour);
          this.switchSection('weekly');
        }
      });
    });
  }
  
}
