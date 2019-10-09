import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Resident, Visitor, Booking, WeeklySchedules, ScheduleSlot, Feedback } from '../classes';
import { mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  /* ALL Component Functions */

  // Get the Firebase Auth state of logged visitor
  getAuthState() {
    return this.afAuth.authState;
  }

  // Get the query snapshot to pass into the getIdFromEmailQuerySnapshot() function
  getQuerySnapshotByEmail(email: string, userType: string) {
    return this.afs.collection(userType + 's', ref => ref.where('email', '==', email)).get();
  }

  // Get the visitor ID form the query snapshot
  getIdFromEmailQuerySnapshot(snapshot) {
    let id = ''
    snapshot.forEach(doc => {
      id = doc.id;
    })
    return id;
  }

  /* ACCOUNT Functions */
  
  // Update the info of the logged visitor
  updateDetails(id: string, phone: string) {
    if(phone != "") this.afs.collection('visitors').doc(id).update({phone: phone});
  }

  /* BOOKING Functions */

  // Get all the bookings in the Firestore
  // which are related to the IDs from the logged visitor's bookingIds array
  getBookings(bookingIds: string[]) {
    let bookingsObs: Observable<Booking>[] = [];
    for(let bookingId of bookingIds) {
      bookingsObs.push(this.afs.collection('bookings').doc(bookingId).valueChanges());
    }
    return combineLatest(bookingsObs)
  }

  // Get a specific booking in Firestore
  booking: Observable<Booking>
  getBooking(id: string) {
    this.booking = this.afs.collection('bookings').doc(id).valueChanges();
    return this.booking
  }

  // Passing Booking ID between components
  private bookingIdSource = new BehaviorSubject<string>("");
  bookingId = this.bookingIdSource.asObservable();
  passBookingId(bookingId: string) {
    this.bookingIdSource.next(bookingId);
  }

  // Converting the nested JS 'schedule' object of a resident into a classed Schedules object
  convertWeeklySchedule(rName: string, schedule: any) {
    let weeklySchedules = new WeeklySchedules(rName, [[],[],[],[],[],[],[]]);
    for(let i = 0; i <= 6; i++) {
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

  // Add a new booking as a visitor
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
      this.getAuthState().pipe(
        mergeMap(authState => {
          return this.getQuerySnapshotByEmail(authState.email, 'visitor');
        }),
        mergeMap(querySnapshot => {
          const visitorId = this.getIdFromEmailQuerySnapshot(querySnapshot);
          const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(visitorId);
          return visitorDoc.valueChanges();
        }),
        take(1))
        .subscribe((visitor) => {
          // Add into the the logged visitor's bookingIds array
          let bookingIds = visitor.bookingIds;
          bookingIds.unshift(bookingId);
          this.afs.collection('visitors').doc(visitor.id).update({bookingIds: bookingIds});
          // Return a success alert
          Swal.fire({
            title: "Success!",
            html: "Booking added successfully!",
            type: 'success'
          })
          this.router.navigate(['/visitor', 'booking-view'])
        })
    })
  }

  // Modify a specific booking with the new date and time slots
  modifyBooking(bookingId: string, date: string, timeSlots: number[]) {
    this.afs.collection('bookings').doc(bookingId).update({
      date: date,
      timeSlots: timeSlots
    })
    .then(() => {
      // Return a success alert
      Swal.fire({
        title: "Success!",
        html: "Booking modified successfully!",
        type: 'success'
      })
      this.router.navigate(['/visitor', 'booking-view'])
    })
  }

  // Cancel a booking
  cancelBooking(id: string) {
    this.afs.collection('bookings').doc(id).update({isCancelled: true})
    .then(() => {
      // Return a success alert
      Swal.fire({
        title: "Success!",
        html: "Booking cancelled!",
        type: 'success'
      })
    })
  }

  /* RESIDENT Functions */

  // Get all the residents in the Firestore
  // which are related to the IDs from the logged visitor's residentIds array
  getResidents(residentIds: string[]) {
    let residentObs: Observable<Resident>[] = [];
    for(let residentId of residentIds) {
      residentObs.push(this.afs.collection('residents').doc(residentId).valueChanges());
    }
    return combineLatest(residentObs)
  }

  // Get a specific resident in Firestore
  resident: Observable<Resident>;
  getResident(id: string) {
    this.resident = this.afs.collection('residents').doc(id).valueChanges();
    return this.resident;
  }

  // Passing Resident ID between components
  private residentIdSource = new BehaviorSubject<string>("");
  residentId = this.residentIdSource.asObservable();
  passResidentId(residentId: string) {
    this.residentIdSource.next(residentId);
  }

  // Find and add the resident to the logged visitor's residentIds array
  addResident(visitorId: string, rFirstName: string, rLastName: string) {
    // Verify if the input resident exists in Firestore
    this.afs.collection('residents', ref =>
      ref.where('rFirstName', '==', rFirstName).where('rLastName', '==', rLastName)).get().toPromise()
      .then(snapshot => {
        if(snapshot.docs.length != 0) {
          const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(visitorId);
          visitorDoc.valueChanges().pipe(take(1)).subscribe(visitor => {
            let residentIds = visitor.residentIds;
            if(!residentIds.includes(snapshot.docs[0].id)) {
              // Add the new resident ID into the residentIDs array
              residentIds.push(snapshot.docs[0].id);
              visitorDoc.update({residentIds: residentIds});
              // Return a success alert
              Swal.fire({
                title: "Success!",
                html: "Resident added!",
                type: 'success'
              })
              .then(() => {
                this.router.navigate(['/visitor', 'resident-view']);
              })
            }
            else { // Return an alert if the input resident has already existed in the residentIDs array
              Swal.fire({
                title: "Error!",
                html: "Resident already added!",
                type: 'error'
              })
            }
          })
        }
        else { // Return an alert if no residents are found
          Swal.fire({
            title: "Error!",
            html: "No residents found!",
            type: 'error'
          })
        }
      })
  }

  // Remove the resident to the logged visitor's residentIds array
  deleteResident(visitorId: string, residentId: string) {
    const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(visitorId);
    visitorDoc.valueChanges().pipe(take(1))
      .subscribe(visitor => {
        // Remove the resident ID from the residentIds array
        let residentIds = visitor.residentIds;
        residentIds = residentIds.filter((value) => {return value != residentId});
        this.afs.collection('bookings', ref => ref.where('residentId', '==', residentId)).get().toPromise()
        .then(bookingSnapshots => {
          let bookingIds = visitor.bookingIds;
          bookingSnapshots.forEach(doc => {
            // Remove the bookings that related to the removed residentId (in visitor scope only)
            bookingIds = bookingIds.filter((value) => {return value != doc.id});
            this.afs.collection('bookings').doc(doc.id).delete();
          })
          visitorDoc.update({
            residentIds: residentIds,
            bookingIds: bookingIds
          });
          // Return a success alert
          Swal.fire({
            title: "Success!",
            html: "Resident deleted!",
            type: 'success'
          })
        });
      })
  }

  /* FEEDBACK Functions */

  // Get the logged visitor's info by ID
  getVisitorById(id: string) {
    const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(id);
    return visitorDoc.valueChanges();
  }

  // Add a feedback in the Firestore
  provideFeedback(visitorId: string, willProvide: boolean, vName?: string, email?: string, title?: string, context?: string) {
    // If the contractor is willing to provide, create a feedback object
    // Else, skip the adding
    if(willProvide) {
      // Getting all of the previous feedbacks
      let feedbackCollections: AngularFirestoreCollection<Feedback> = this.afs.collection('feedbacks')
      feedbackCollections.valueChanges().pipe(take(1))
      .subscribe(feedbacks => {
        // Generate an appropriate feedback ID (8 digits starting from 00000001)
        let newId = ''
        if(feedbacks.length != 0) { // If there are feedbacks in Firestore
          const latestId = feedbacks[feedbacks.length - 1].id;
          // New feedback ID = Old feedback ID + 1
          const newIdStr = (parseInt(latestId) + 1).toString();
          newId = '00000000'.substring(0, 8 - newIdStr.length) + newIdStr
        }
        else { // If there are no feedbacks in Firestore
          newId = '00000001'
        }
        // Add into the 'feedback' collection
        const date = new Date();
        const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
        + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
        + date.getFullYear();
        const feedback = new Feedback(newId, title, vName, email, 'Visitor', dateStr, context);
        this.afs.collection('feedbacks').doc(newId).set(Object.assign({}, feedback))
      })
      // Return a success alert
      Swal.fire({
        title: "Submitted!",
        html: "Thanks for the feedback!",
        type: 'success'
      })
    }
    // Providing feedback or not, either way stop the asking loop
    this.afs.collection('visitors').doc(visitorId).update({justCheckOut: false})
  }
}
