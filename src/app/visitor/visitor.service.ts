import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { Resident, Visitor, Booking, WeeklySchedules, ScheduleSlot } from '../classes';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  private idSource = new BehaviorSubject<string>("");
  id = this.idSource.asObservable();

  passId(id: string) {
    this.idSource.next(id);
  }

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

  updateDetails(id: string, phone: string) {
    if(phone != "") this.afs.collection('visitors').doc(id).update({phone: phone});
  }

  getVisitorById(id: string) {
    const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(id);
    return visitorDoc.valueChanges();
  }

  booking: Observable<Booking>;

  getBookings(bookingIds: string[]) {
    let bookingsObs: Observable<Booking>[] = [];
    for(let bookingId of bookingIds) {
      bookingsObs.push(this.afs.collection('bookings').doc(bookingId).valueChanges());
    }
    return combineLatest(bookingsObs)
  }

  getBooking(id: string) {
    this.booking = this.afs.collection('bookings').doc(id).valueChanges();
    return this.booking;
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
  private bookedSlotsSource = new BehaviorSubject<number[]>([]);
  bookedSlots = this.bookedSlotsSource.asObservable();

  getBookedSlots(date: string) {
    let bookedSlots = [];
    this.afs.collection('bookings', ref => ref.where('date', '==', date).where('isCancelled', '==', false)).get().toPromise()
      .then(snapshot => {
        snapshot.forEach(doc => {
          bookedSlots.concat(doc.data().timeSlots);
        })
        this.bookedSlotsSource.next(bookedSlots);
      })
  }

  addBooking(residentId: string, rName: string, date: string, timeSlots: number[]) {
    this.bookingsCollection = this.afs.collection('bookings');
    this.bookingsCollection.get().toPromise().then(bookingSnapshot => {
      const latestId = bookingSnapshot.docs[bookingSnapshot.docs.length - 1].id;
      const newIdentifier = parseInt(latestId.substring(8)) + 1;
      const id = date.substring(6) + date.substring(3, 5) + date.substring(0, 2) + ((newIdentifier < 10) ? "0" + newIdentifier.toString() : newIdentifier.toString());
      const booking = new Booking(id, residentId, rName, date, timeSlots, false);
      this.bookingsCollection.doc(id).set(Object.assign({}, booking))
      this.getAuthState().pipe(
        mergeMap(authState => {
          return this.getQuerySnapshotByEmail(authState.email, 'visitor');
        }))
        .toPromise().then(querySnapshot => {
          const visitorId = this.getIdFromEmailQuerySnapshot(querySnapshot);
          const visitorDoc: AngularFirestoreDocument<Visitor> = this.afs.collection('visitors').doc(visitorId);
          visitorDoc.valueChanges().toPromise()
            .then((visitor) => {
              let bookingIds = visitor.residentIds;
              bookingIds.unshift(id);
              visitorDoc.update({bookingIds: bookingIds});
            })
            .then(() => {
              swal({
                title: "Success!",
                text: "Booking added succesfully!",
                icon: "success",
                buttons: {
                  ok: "OK"
                }
              } as any)
            });
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
        text: "Booking modified succesfully!",
        icon: "success",
        buttons: {
          ok: "OK"
        }
      } as any)
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
          visitorDoc.valueChanges().toPromise()
            .then(visitor => {
              let residentIds = visitor.residentIds;
              residentIds.push(snapshot.docs[0].id);
              visitorDoc.update({residentIds: residentIds});
            })
            .then(() => {
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
    visitorDoc.valueChanges().toPromise()
      .then(visitor => {
        let residentIds = visitor.residentIds;
        residentIds = residentIds.filter((value) => {return value != residentId});
        visitorDoc.update({residentIds: residentIds});
      })
      .then(() => {
        swal("Resident deleted!", {
          icon: "success",
        })
      })
  }
}
