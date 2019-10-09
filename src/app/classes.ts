export class IDList {
  constructor(
    public id?: string
  ) { }
}

export class User {
  constructor(
    public id?: string,
    public email?: string,
    public userType?: string // 'visitor', 'contractor', 'staff' or 'admin'
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
    public inFacility?: boolean, // used to calculate the number of current contractors in the facility
    public justCheckOut?: boolean // ask for feedback if the contractor just checks out
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

export class Resident {
  constructor(
    public id?: string,
    public rFirstName?: string,
    public rLastName?: string,
    public phone?: string,
    /*
    A nested object that represents a static weekly schedule of a resident
    This nested object contains 7 other objects representing 7 days of a week
    Each day object contains 16 time slots objects (from 7AM to 10PM)
    Each time slot object contains an 'isAvailable' boolean and an 'activity' string
    // isAvailable: checks if a resident is free in that time slot
    // activity: if isAvailable = false, an activity represents a reason why the resident is busy
    (Check ScheduleSlot class)
    */
    public schedule?: any
  ) { }
}

// a separated Resident class just for creating new residents
// the 'schedule' property will be updated after when the new resident is added in Firebase
export class ResidentAdd {
  constructor(
    public id?: string,
    public rFirstName?: string,
    public rLastName?: string,
    public phone?: string
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
    public flags?: Flag[], // used to block dangerous visitors from entering the facility
    public inFacility?: boolean, // used to calculate the number of current visitors in the facility
    public justCheckOut?: boolean // ask for feedback if the visitor just checks out
  ) { }
}

export class Booking {
  constructor(
    public id?: string,
    public residentId?: string,
    public rName?: string,
    public date?: string,
    public timeSlots?: number[], // the booked time slots must be consecutive to each other
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
