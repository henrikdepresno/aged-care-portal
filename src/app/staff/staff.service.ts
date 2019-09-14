import { Injectable } from '@angular/core';
import { ResidentView, ScheduleSlot, VisitorView, WeeklySchedules, Feedback } from '../classes-output';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor() { }

  getCurrentVisitorNumber(): number {
    const num = 10;
    return num;
  }

  getResidentViews(): ResidentView[] {
    const residentViews: ResidentView[] = [
      new ResidentView("Charles", "Charleston"),
      new ResidentView("Jacques", "Bates"),
      new ResidentView("Shayna", "Stanton"),
      new ResidentView("Aasiyah", "Terrell"),
      new ResidentView("Angharad", "Moreno"),
      new ResidentView("Roscoe", "William"),
      new ResidentView("Kallum", "Jensen"),
      new ResidentView("Gerard", "Castaneda"),
      new ResidentView("Isabella", "Velez"),
      new ResidentView("Shakira", "Tyson"),
      new ResidentView("Ibraheem", "Brooks")
    ];
    return residentViews;
  }

  getVisitorViews(): VisitorView[] {
    const visitorViews: VisitorView[] = [
      new VisitorView("Arian", "Jacobson", false),
      new VisitorView("Jadene", "Kane", false),
      new VisitorView("Ida", "Esquivel", false),
      new VisitorView("Carmel", "Conway", false),
      new VisitorView("Nusaybah", "Horne", false),
      new VisitorView("Mekhi", "Diaz", true),
      new VisitorView("Rudi", "Betts", false),
      new VisitorView("Arjan", "Forbes", false),
      new VisitorView("Arman", "Haigh", false),
      new VisitorView("Md", "Cannon", true),
      new VisitorView("Gabriela", "Coles", false),
      new VisitorView("Micheal", "Davey", true),
      new VisitorView("Jeremy", "Whelan", false),
      new VisitorView("Danyal", "Carter", false),
      new VisitorView("Taybah", "Jaramillo", false),
      new VisitorView("Tasha", "Wilks", true),
      new VisitorView("Menna", "Chaney", false),
      new VisitorView("Tania", "Kirkland", false),
      new VisitorView("Vikki", "Ellis", false),
      new VisitorView("Saxon", "Oneil", false)
    ];
    return visitorViews;
  }

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

  getRatings(): number[] {
    const one = 4;
    const two = 3;
    const three = 5;
    const four = 15;
    const five = 23;
    return [one, two, three, four, five];
  }

  getFeedbacks(): Feedback[] {
    const feedbacks: Feedback[] = [
      new Feedback("Bad Ventilation", "Arian", "Jacobson", "Visitor", new Date(2019, 6, 12, 14, 0, 0), ""),
      new Feedback("Rude Staff!", "Arjan", "Forbes", "Visitor", new Date(2019, 6, 10, 14, 0, 0), ""),
      new Feedback("Lovely place", "Arman", "Haigh", "Visitor", new Date(2019, 6, 5, 14, 0, 0), ""),
      new Feedback("great service", "Dixon", "Hills", "Contractor", new Date(2019, 5, 23, 14, 0, 0), ""),
      new Feedback("Helpful staff!", "Saxon", "Oneil", "Visitor", new Date(2019, 5, 21, 14, 0, 0), "")
    ];
    return feedbacks;
  }
}
