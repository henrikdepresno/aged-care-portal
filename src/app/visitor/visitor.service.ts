import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import swal from 'sweetalert';
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

  getAuthState() {
    return this.afAuth.authState;
  }

  getQuerySnapshotByEmail(email: string, userType: string) {
    return this.afs.collection(userType + 's', ref => ref.where('email', '==', email)).get();
  }

  getIdFromEmailQuerySnapshot(snapshot) {
    let id = ''
    snapshot.forEach(doc => {
      id = doc.id;
    })
    return id;
  }

  getVisitorById(id: string) {
    const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(id);
    return visitorDoc.valueChanges();
  }

  updateDetails(id: string, phone: string) {
    if(phone != "") this.afs.collection('visitors').doc(id).update({phone: phone});
  }

  getBookings(bookingIds: string[]) {
    let bookingsObs: Observable<Booking>[] = [];
    for(let bookingId of bookingIds) {
      bookingsObs.push(this.afs.collection('bookings').doc(bookingId).valueChanges());
    }
    return combineLatest(bookingsObs)
  }

  booking: Observable<Booking>

  getBooking(id: string) {
    this.booking = this.afs.collection('bookings').doc(id).valueChanges();
    return this.booking
  }

  private bookingIdSource = new BehaviorSubject<string>("");
  bookingId = this.bookingIdSource.asObservable();

  passBookingId(bookingId: string) {
    this.bookingIdSource.next(bookingId);
  }

  convertWeeklySchedule(rName: string, schedule: any) {
    let weeklySchedules = new WeeklySchedules(rName, [[],[],[],[],[],[],[]]);
    for(let i = 0; i <= 6; i++) {
      for(let h = 7; h <= 22; h++) {
        weeklySchedules.schedules[i].push(new ScheduleSlot(h, schedule[i][h].available, schedule[i][h].activity));
      }
    }
    return weeklySchedules;
  }

  bookingsCollection: AngularFirestoreCollection<Booking>;

  getBookedSlots(snapshot) {
    let bookedSlots: number[] = [];
    snapshot.forEach(doc => {
      bookedSlots = bookedSlots.concat(doc.data().timeSlots);
    })
    return bookedSlots;
  }

  getBookingsByDate(residentId: string, date: string) {
    return this.afs.collection('bookings', ref => ref
      .where('residentId', '==', residentId)
      .where('date', '==', date)
      .where('isCancelled', '==', false)).get();
  }

  addBooking(residentId: string, rName: string, date: string, timeSlots: number[]) {
    this.bookingsCollection = this.afs.collection('bookings', ref => ref.where('date', '==', date));
    this.bookingsCollection.get().toPromise().then(bookingSnapshot => {
      let bookingId = "";
      if(bookingSnapshot.docs.length != 0) {
        const latestId = bookingSnapshot.docs[bookingSnapshot.docs.length - 1].id;
        const newIdentifier = parseInt(latestId.substring(8)) + 1;
        bookingId = date.substring(6) + date.substring(3, 5) + date.substring(0, 2) + ((newIdentifier < 10) ? "0" + newIdentifier.toString() : newIdentifier.toString());
      }
      else {
        bookingId = date.substring(6) + date.substring(3, 5) + date.substring(0, 2) + "01";
      }
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
          let bookingIds = visitor.bookingIds;
          bookingIds.unshift(bookingId);
          this.afs.collection('visitors').doc(visitor.id).update({bookingIds: bookingIds});
          swal({
            title: "Success!",
            text: "Booking added successfully!",
            icon: "success",
            buttons: {
              ok: "OK"
            }
          } as any)
          this.router.navigate(['/visitor', 'booking-view'])
        })
    })
  }

  modifyBooking(bookingId: string, date: string, timeSlots: number[]) {
    this.afs.collection('bookings').doc(bookingId).update({
      date: date,
      timeSlots: timeSlots
    })
    .then(() => {
      swal({
        title: "Success!",
        text: "Booking modified successfully!",
        icon: "success",
        buttons: {
          ok: "OK"
        }
      } as any)
      this.router.navigate(['/visitor', 'booking-view'])
    })
  }

  cancelBooking(id: string) {
    this.afs.collection('bookings').doc(id).update({isCancelled: true})
    .then(() => {
      swal({
        title: "Success!",
        text: "Booking cancelled!",
        icon: "success",
        buttons: {
          ok: "OK"
        }
      } as any)
    })
  }

  resident: Observable<Resident>;

  getResidents(residentIds: string[]) {
    let residentObs: Observable<Resident>[] = [];
    for(let residentId of residentIds) {
      residentObs.push(this.afs.collection('residents').doc(residentId).valueChanges());
    }
    return combineLatest(residentObs)
  }

  getResident(id: string) {
    this.resident = this.afs.collection('residents').doc(id).valueChanges();
    return this.resident;
  }

  private residentIdSource = new BehaviorSubject<string>("");
  residentId = this.residentIdSource.asObservable();

  passResidentId(residentId: string) {
    this.residentIdSource.next(residentId);
  }

  addResident(visitorId: string, rFirstName: string, rLastName: string) {
    this.afs.collection('residents', ref =>
      ref.where('rFirstName', '==', rFirstName).where('rLastName', '==', rLastName)).get().toPromise()
      .then(snapshot => {
        if(snapshot.docs.length != 0) {
          const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(visitorId);
          visitorDoc.valueChanges().pipe(take(1)).subscribe(visitor => {
            let residentIds = visitor.residentIds;
            if(!residentIds.includes(snapshot.docs[0].id)) {
              residentIds.push(snapshot.docs[0].id);
              visitorDoc.update({residentIds: residentIds});
              swal({
                title: "Success!",
                text: "Resident added",
                icon: "success",
                buttons: {
                  ok: "OK"
                }
              } as any)
              .then(() => {
                this.router.navigate(['/visitor', 'resident-view']);
              })
            }
            else {
              swal({
                title: "Error!",
                text: "Resident already added!",
                icon: "error",
                buttons: {
                  ok: "OK"
                }
              } as any); 
            }
          })
        }
        else {
          swal({
            title: "Error!",
            text: "No residents found!",
            icon: "error",
            buttons: {
              ok: "OK"
            }
          } as any);
        }
      })
  }

  deleteResident(visitorId: string, residentId: string) {
    const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(visitorId);
    visitorDoc.valueChanges().pipe(take(1))
      .subscribe(visitor => {
        let residentIds = visitor.residentIds;
        residentIds = residentIds.filter((value) => {return value != residentId});
        this.afs.collection('bookings', ref => ref.where('residentId', '==', residentId)).get().toPromise()
        .then(bookingSnapshots => {
          let bookingIds = visitor.bookingIds;
          bookingSnapshots.forEach(doc => {
            bookingIds = bookingIds.filter((value) => {return value != doc.id});
            this.afs.collection('bookings').doc(doc.id).delete();
          })
          visitorDoc.update({
            residentIds: residentIds,
            bookingIds: bookingIds
          });
          swal("Resident deleted!", {
            icon: "success",
          })
        });
      })
  }

  provideFeedback(visitorId: string, willProvide: boolean, vName?: string, email?: string, title?: string, context?: string) {
    if(willProvide) {
      let feedbackCollections: AngularFirestoreCollection<Feedback> = this.afs.collection('feedbacks')
      feedbackCollections.valueChanges().pipe(take(1))
      .subscribe(feedbacks => {
        let newId = ''
        if(feedbacks.length != 0) {
          const latestId = feedbacks[feedbacks.length - 1].id;
          const newIdStr = (parseInt(latestId) + 1).toString();
          newId = '00000000'.substring(0, 8 - newIdStr.length) + newIdStr
        }
        else {
          newId = '00000001'
        }
        const date = new Date();
        const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
        + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
        + date.getFullYear();
        const feedback = new Feedback(newId, title, vName, email, 'Visitor', dateStr, context);
        this.afs.collection('feedbacks').doc(newId).set(Object.assign({}, feedback))
      })
      swal({
        title: "Submitted!",
        text: "Thanks for the feedback!",
        icon: "success",
        buttons: {
          ok: "OK"
        }
      } as any)
    }
    this.afs.collection('visitors').doc(visitorId).update({justCheckOut: false})
  }
}
