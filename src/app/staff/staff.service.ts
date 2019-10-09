import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject } from 'rxjs';
import { Resident, Visitor, Flag, Rating, Feedback, WeeklySchedules, ScheduleSlot, Booking } from '../classes';
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  /* ALL Components Functions */

  getCurrentVisitors() {
    return this.afs.collection('visitors', ref => ref.where('inFacility', '==', true)).get();
  }

  getCurrentContractors() {
    return this.afs.collection('contractors', ref => ref.where('inFacility', '==', true)).get();
  }

  /* RESIDENT Functions */

  // Passing Resident ID between components to access a resident's schedule
  private residentIdSource = new BehaviorSubject<string>("");
  residentId = this.residentIdSource.asObservable();
  passResidentId(id: string) {
    this.residentIdSource.next(id);
  }

  // Get all the residents in the Firestore
  residents: Observable<Resident[]>;
  getResidents() {
    this.residents = this.afs.collection('residents').valueChanges();
    return this.residents;
  }

  // Get a specific resident in Firestore
  resident: Observable<Resident>;
  getResident(id: string) {
    this.resident = this.afs.collection('residents').doc(id).valueChanges();
    return this.resident;
  }

  // Converting the nested JS 'schedule' object of a resident into a classed Schedules object
  convertWeeklySchedule(rName: string, schedule: any) {
    let weeklySchedules = new WeeklySchedules(rName, [[],[],[],[],[],[],[]]);
    // Looping through 7 days
    for(let i = 0; i <= 6; i++) {
      // Looping through all the time slots each day
      for(let h = 7; h <= 22; h++) {
        weeklySchedules.schedules[i].push(new ScheduleSlot(h, schedule[i][h].available, schedule[i][h].activity));
      }
    }
    return weeklySchedules;
  }

  // Getting all the CONFIRMED bookings of a specific date
  getBookingsByDate(residentId: string, date: string) {
    return this.afs.collection('bookings', ref => ref
      .where('residentId', '==', residentId)
      .where('date', '==', date)
      .where('isCancelled', '==', false)).get();
  }

  // Getting all the time slots which have been booked in the 'bookings' collection of a specific date
  getBookedSlots(snapshot) {
    let bookedSlots: number[] = [];
    snapshot.forEach(doc => {
      bookedSlots = bookedSlots.concat(doc.data().timeSlots);
    })
    return bookedSlots;
  }

  // Add a new booking as a staff
  bookingsCollection: AngularFirestoreCollection<Booking>;
  addBooking(residentId: string, rName: string, date: string, timeSlots: number[]) {
    // Getting all of the previous bookings of the selected date
    this.bookingsCollection = this.afs.collection('bookings', ref => ref.where('date', '==', date));
    this.bookingsCollection.get().toPromise().then(bookingSnapshot => {
      // Generate an appropriate booking ID
      /*
      A booking ID is in a specific format: YYYYMMDDXX
      - YYYY is the booking year
      - MM is the booking month (01 - 12)
      - DD is the booking date (01 - 31)
      - XX is an unique identifier, starts from 01
      */
      let bookingId = "";
      if(bookingSnapshot.docs.length != 0) { // If there are bookings in that date
        const latestId = bookingSnapshot.docs[bookingSnapshot.docs.length - 1].id;
        // New booking ID's XX = Old booking ID's XX + 1
        const newIdentifier = parseInt(latestId.substring(8)) + 1;
        // Generate a booking ID where XX is incremented by 1
        bookingId = date.substring(6) + date.substring(3, 5) + date.substring(0, 2) + ((newIdentifier < 10) ? "0" + newIdentifier.toString() : newIdentifier.toString());
      }
      else { // If there are no bookings in that date
        // Generate a booking ID where XX starts from 01
        bookingId = date.substring(6) + date.substring(3, 5) + date.substring(0, 2) + "01";
      }
      // Add into the 'booking' collection
      const booking = new Booking(bookingId, residentId, rName, date, timeSlots, false);
      this.bookingsCollection.doc(bookingId).set(Object.assign({}, booking))
        .then(() => {
          // Return a success alert
          Swal.fire({
            title: "Success!",
            html: "Booking added successfully!",
            type: 'success'
          })
          this.router.navigate(['/staff', 'resident-view'])
        })
    })
  }

  // Change a specific time slot's availability and activity in a resident's schedule
  makeScheduleChange(residentId: string, activity: string, day: number, hour: number) {
    // If the time slot is set to be available, the 'activity' property will be left empty
    activity = (activity == "Available") ? "" : activity;
    // Update the time slot
    const update = {};
    update[`schedule.${day}.${hour}`] = {
      activity: activity,
      available: (activity == "")
    }
    this.afs.collection('residents').doc(residentId).update(update)
      .then(() => {
        // Return a success alert
        Swal.fire({
          title: "Success!",
          html: "Change made!",
          type: 'success'
        })
      })
  }

  /* VISITOR Functions */

  // Get all the visitors in the Firestore
  visitors: Observable<Visitor[]>;
  getVisitors() {
    this.visitors = this.afs.collection('visitors').valueChanges();
    return this.visitors;
  }

  // Flag a visitor
  flagVisitor(id: string, reason: string) {
    // Get the name of the staff
    // using Firebase Auth state of logged staff + Firestore (email)
    this.afAuth.authState.pipe(take(1))
      .subscribe(user => {
        this.afs.collection('staffs', ref => ref.where('email', '==', user.email)).get().toPromise()
          .then(snapshot => {
            snapshot.forEach(doc => {
              const staffName = doc.data().sFirstName + " " + doc.data().sLastName;
              this.afs.collection('visitors').doc(id).get().toPromise()
              .then((doc) => {
                // Get the flags array of that visitor
                let flags: any[] = doc.data().flags;
                const date = new Date();
                const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
                  + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
                  + date.getFullYear();
                // Update the flags array with a new flag inserted
                flags.unshift(new Flag(dateStr, staffName, reason));
                this.afs.collection('visitors').doc(id).update({flags: JSON.parse(JSON.stringify(flags))});
                // Return a success alert
                Swal.fire({
                  title: "Success!",
                  html: "Visitor flagged!",
                  type: 'success'
                })
              })
            })
          })
      })
  }

  /* FEEDBACK Functions */

  // Get the number of each rating (1-5) in the Firestore
  ratings: Observable<Rating>;
  getRatings() {
    this.ratings = this.afs.collection('ratings').doc('ratings').valueChanges();
    return this.ratings;
  }

  // Get all the feedbacks in the Firestore
  feedbacks: Observable<Feedback[]>;
  getFeedbacks() {
    this.feedbacks = this.afs.collection('feedbacks').valueChanges();
    return this.feedbacks;
  }
}
