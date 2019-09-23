import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import swal from 'sweetalert';
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

  id: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private staffService: StaffService,
    @Optional() private initialClick: boolean,
    @Optional() private weeklySchedules: WeeklySchedules,
    @Optional() private today: Date,
    @Optional() private selectedSlots: number[]
  ) { }

  jB = "section#list-booking ";
  jW = "section#list-weekly ";

  ngOnInit() {
    this.router.navigate(['/staff', 'resident-schedule']);

    this.validateUserType().then(res => {
      if(res) {
        this.staffService.residentId.pipe(
          mergeMap(id => {
            this.id = id;
            return this.staffService.getResident(this.id);
          }),
          mergeMap(resident => {
            const rName = resident.rFirstName + " " + resident.rLastName;
            this.weeklySchedules = this.staffService.convertWeeklySchedule(rName, resident.schedule);
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
      resolve(this.router.url.includes("/staff/resident-schedule"));
    })
  }

  loadComponent() {
    $(this.jB + ' div#list-main > h1').text("MAKE A BOOKING: " + this.weeklySchedules.rName);
    $(this.jW + ' div#list-main > h1').text("WEEKLY SCHEDULE: " + this.weeklySchedules.rName);

    this.loadWeeklySchedule();

    this.selectedSlots = [];
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

  switchSection(section: string) {
    if(section == "booking") {
      $('section#list-weekly').hide();
      $('section#list-booking').show();
    }
    else {
      $('section#list-booking').hide();
      $('section#list-weekly').show();
    }
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
    const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
      + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
      + date.getFullYear();
    this.staffService.getBookedSlots(dateStr);
    this.staffService.bookedSlots.toPromise()
      .then((bookedSlots) => {
        const daySchedule = this.weeklySchedules.schedules[date.getDay()];
        for(let i = 7; i <= 22; i++) {
          if(daySchedule[i - 7].hour == i){
            if(bookedSlots.includes(i)) {
              $(this.jB + 'p#task-'+ i).text("Booked");
              $(this.jB + 'div#task-div-'+ i +" > span").css({
                'background-color': '#EDAAAA',
                'cursor': 'not-allowed'
              });
            }
            else if(!daySchedule[i - 7].available){
              $(this.jB + 'p#task-'+ i).text(daySchedule[i - 7].activity);
              $(this.jB + 'div#task-div-'+ i +" > span").css({
                'background-color': '#EDAAAA',
                'cursor': 'not-allowed'
              });
            }
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
    if(this.selectedSlots.includes(hour)){
      if(arrayConsecutive(this.selectedSlots, hour, false)) {
        $(this.jB + 'p#task-'+ hour).text("Available");
        $(this.jB + 'div#task-div-'+ hour +" > span").css({
          'background-color': '#C4DBB3',
          'cursor': 'pointer'
        });
        this.selectedSlots = this.selectedSlots.filter((value) => {return value == hour});
      }
      else {
        swal({
          title: "Error!",
          text: "Time slots must be next to each other!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
      }
    }
    else {
      if(arrayConsecutive(this.selectedSlots, hour, true)) {
        $(this.jB + 'p#task-'+ hour).text("Selected");
        $(this.jB + 'div#task-div-'+ hour +" > span").css({
          'background-color': '#9BCCE7',
          'cursor': 'pointer'
        });
        this.selectedSlots.push(hour);
        sortNumArray(this.selectedSlots);
      }
      else {
        swal({
          title: "Error!",
          text: "Time slots must be next to each other!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
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
    if(this.selectedSlots.length != 0) {
      const dateStr = (this.today.getDate() < 10 ? "0" + this.today.getDate() : this.today.getDate()) + "/"
      + (this.today.getMonth() + 1 < 10 ? "0" + (this.today.getMonth() + 1) : this.today.getMonth() + 1) + "/"
      + this.today.getFullYear();
      swal({
        title: "Add?",
        text: `Are you sure you want to add this booking?
        Visiting time: ${this.selectedSlots[0]}:00 ${dateStr}`,
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: "Cancel",
          ok: "Yes"
        }
      } as any)
      .then((willAdd) => {
        if(willAdd) {
          this.staffService.addBooking(this.id, dateStr, this.selectedSlots);
        }
      })
    }
    else {
      swal({
        title: "Error!",
        text: "Please select at least one booking slot!",
        icon: "error",
        buttons: {
          ok: "OK"
        }
      } as any)
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
    swal({
      text: `Change activity on ${dayStr} at ${hour}:00
      (Leave the field empty or type "Activity"
      if you want to make the slot vacant)`,
      content: {
        element: "input",
        attributes: {
          placeholder: "Reason",
          type: "text",
        },
      },
    })
    .then((inputActivity) => {
      const activity = (inputActivity == "") ? "Available" : inputActivity.charAt(0).toUpperCase() + inputActivity.toLowerCase().slice(1);
      swal({
        title: "Make changes?",
        text: `${oldActivity} → ${activity}
        on ${dayStr} at ${hour}:00?`,
        icon: "info",
        dangerMode: true,
        buttons: {
          cancel: "Cancel",
          ok: "Change"
        }
      } as any)
      .then((willChange) => {
        if(willChange) {
          this.staffService.makeScheduleChange(this.id, activity, day, hour);
        }
      });
    });
  }
  
}
