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
    public field?: string
  ) { }
}

export class Resident {
  constructor(
    public id?: string,
    public rFirstName?: string,
    public rLastName?: string,
    public phone?: string,
    public email?: string
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
    public resident?: Resident,
    public date?: string,
    public timeSlots?: number[],
    public isCancelled?: boolean
  ) { }
}

export class Flag {
  constructor(
    public date?: string,
    public staff?: string,
    public reason?: string
  ) { }
}