export class BookingView {
  constructor(
    public rFirstName: string,
    public status: string,
    public time: Date
  ) { }
}

export class ContractorView {
  constructor(
    public id: string,
    public cFirstName: string,
    public cLastName: string
  ) { }
}

export class StaffView {
  constructor(
    public id: string,
    public sFirstName: string,
    public sLastName: string
  ) { }
}

export class ResidentView {
  constructor(
    public rFirstName: string,
    public rLastName: string
  ) { }
}

export class VisitorView {
  constructor(
    public vFirstName: string,
    public vLastName: string,
    public isFlagged: boolean
  ) { }
}

export class Feedback {
  constructor(
    public title: string,
    public firstName: string,
    public lastName: string,
    public role: string,
    public date: Date,
    public context: string
  ) { }
}

export class Flag {
  constructor(
    public date: Date,
    public staff: string,
    public reason: string
  ) { }
}

export class ScheduleSlot {
  constructor(
    public hour: number,
    public available: boolean,
    public activity: string
  ) { }
}

export class WeeklySchedules {
  constructor(
    public rFirstName: string,
    public rLastName: string,
    public schedules: ScheduleSlot[][]
  ) { }
}
