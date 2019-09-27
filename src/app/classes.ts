export class IDList {
  constructor(
    public id?: string
  ) { }
}

export class User {
  constructor(
    public id?: string,
    public email?: string,
    public userType?: string
  ) { }
}

export class Contractor {
  constructor(
    public id?: string,
    public cFirstName?: string,
    public cLastName?: string,
    public phone?: string,
    public email?: string,
    public companyName?: string,
    public field?: string,
    public justCheckOut?: boolean
  ) { }
}

export class Staff {
  constructor(
    public id?: string,
    public sFirstName?: string,
    public sLastName?: string,
    public phone?: string,
    public email?: string,
    public role?: string
  ) { }
}

export class ResidentAdd {
  constructor(
    public id?: string,
    public rFirstName?: string,
    public rLastName?: string,
    public phone?: string
  ) { }
}

export class Resident {
  constructor(
    public id?: string,
    public rFirstName?: string,
    public rLastName?: string,
    public phone?: string,
    public schedule?: any
  ) { }
}

export class Visitor {
  constructor(
    public id?: string,
    public vFirstName?: string,
    public vLastName?: string,
    public email?: string,
    public phone?: string,
    public residentIds?: string[],
    public bookingIds?: string[],
    public flags?: Flag[],
    public inFacility?: boolean,
    public justCheckOut?: boolean
  ) { }
}

export class Booking {
  constructor(
    public id?: string,
    public residentId?: string,
    public rName?: string,
    public date?: string,
    public timeSlots?: number[],
    public isCancelled?: boolean
  ) { }
}

export class Rating {
  constructor(
    public one?: number,
    public two?: number,
    public three?: number,
    public four?: number,
    public five?: number,
  ) { }
}

export class Feedback {
  constructor(
    public id?: string,
    public title?: string,
    public author?: string,
    public authorEmail?: string,
    public role?: string,
    public date?: string,
    public context?: string
  ) { }
}

export class Flag {
  constructor(
    public date?: string,
    public staff?: string,
    public reason?: string
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
    public rName: string,
    public schedules: ScheduleSlot[][]
  ) { }
}
