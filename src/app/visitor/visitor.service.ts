import { Injectable } from '@angular/core';
import { BookingView, ResidentView, WeeklySchedules, ScheduleSlot } from '../classes-output';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor() { }

  getVisitorId(): string {
    const id = "1ABC2";
    return id;
  }

  //V-B-View
  getBookingViews(): BookingView[] {
    const bookingViews: BookingView[] = [
      new BookingView("Charles", "Confirmed", new Date(2019, 6, 12, 14, 0, 0)),
      new BookingView("Lisa", "Confirmed", new Date(2019, 6, 12, 13, 0, 0)),
      new BookingView("Charles", "Visited", new Date(2019, 6, 3, 11, 0, 0)),
      new BookingView("Charles", "Visited", new Date(2019, 5, 21, 14, 0, 0)),
      new BookingView("Charles", "Cancelled", new Date(2019, 5, 21, 12, 0, 0)),
      new BookingView("Lisa", "Visited", new Date(2019, 4, 30, 15, 0, 0)),
      new BookingView("Lisa", "Cancelled", new Date(2019, 4, 29, 12, 0, 0)),
      new BookingView("Charles", "Visited", new Date(2019, 4, 23, 11, 0, 0)),
      new BookingView("Lisa", "Visited", new Date(2019, 4, 17, 11, 0, 0)),
      new BookingView("Charles", "Visited", new Date(2019, 4, 15, 12, 0, 0)),
      new BookingView("Charles", "Cancelled", new Date(2019, 4, 15, 15, 0, 0))
    ];
    return bookingViews;
  }

  //V-R-View
  getResidentViews(): ResidentView[] {
    const residentViews: ResidentView[] = [
      new ResidentView("Charles", "Charleston"),
      new ResidentView("Lisa", "Bates")
    ];
    return residentViews;
  }

  //V-B-Add, V-B-Modify (R-Schedule)
  getWeeklySchedules(): WeeklySchedules {
    const weeklySchedules: WeeklySchedules = new WeeklySchedules("Charles", "Charleston",
    [
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, false, "Meeting booked with Jamie"),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ],
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, true, ""),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ],
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, true, ""),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ],
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, true, ""),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ],
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, true, ""),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ],
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, true, ""),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ],
      [
        new ScheduleSlot(7, false, "Sleep"),
        new ScheduleSlot(8, false, "Medicine / Waking up"),
        new ScheduleSlot(9, false, "Breakfast"),
        new ScheduleSlot(10, true, ""),
        new ScheduleSlot(11, true, ""),
        new ScheduleSlot(12, true, ""),
        new ScheduleSlot(13, false, "Lunch"),
        new ScheduleSlot(14, true, ""),
        new ScheduleSlot(15, false, "Afternoon tea"),
        new ScheduleSlot(16, true, ""),
        new ScheduleSlot(17, true, ""),
        new ScheduleSlot(18, false, "Dinner"),
        new ScheduleSlot(19, true, ""),
        new ScheduleSlot(20, true, ""),
        new ScheduleSlot(21, false, "Preparation for sleep / Medicine"),
        new ScheduleSlot(22, false, "Sleep")
      ]
    ]);
    return weeklySchedules;
  }
}
