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
