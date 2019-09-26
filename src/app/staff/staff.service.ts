import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import swal from 'sweetalert';
import { Observable, BehaviorSubject } from 'rxjs';
import { Resident, Visitor, Flag, Rating, Feedback, WeeklySchedules, ScheduleSlot, Booking } from '../classes';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  getCurrentVisitors() {
    return this.afs.collection('visitors', ref => ref.where('inFacility', '==', true)).get();
  }

  private residentIdSource = new BehaviorSubject<string>("");
  residentId = this.residentIdSource.asObservable();

  passResidentId(id: string) {
    this.residentIdSource.next(id);
  }

  residents: Observable<Resident[]>;
  resident: Observable<Resident>;

  getResidents() {
    this.residents = this.afs.collection('residents').valueChanges();
    return this.residents;
  }

  getResident(id: string) {
    this.resident = this.afs.collection('residents').doc(id).valueChanges();
    return this.resident;
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

  getBookingsByDate(date: string) {
    return this.afs.collection('bookings', ref => ref.where('date', '==', date).where('isCancelled', '==', false)).get();
  }


  addBooking(residentId: string, rName: string, date: string, timeSlots: number[]) {
    this.bookingsCollection = this.afs.collection('bookings');
    this.bookingsCollection.get().toPromise().then(bookingSnapshot => {
      const latestId = bookingSnapshot.docs[bookingSnapshot.docs.length - 1].id;
      const newIdentifier = parseInt(latestId.substring(8)) + 1;
      const id = date.substring(6) + date.substring(3, 5) + date.substring(0, 2) + ((newIdentifier < 10) ? "0" + newIdentifier.toString() : newIdentifier.toString());
      const booking = new Booking(id, residentId, rName, date, timeSlots, false);
      this.bookingsCollection.doc(id).set(Object.assign({}, booking))
        .then(() => {
          swal({
            title: "Success!",
            text: "Booking added successfully!",
            icon: "success",
            buttons: {
              ok: "OK"
            }
          } as any)
        });
    })
  }

  makeScheduleChange(residentId: string, activity: string, day: number, hour: number) {
    activity = (activity == "Available") ? "" : activity;
    const update = {};
    update[`schedule.${day}.${hour}`] = {
      activity: activity,
      isAvailable: (activity == "")
    }
    this.afs.collection('residents').doc(residentId).update(update)
      .then(() => {
        swal({
          title: "Success!",
          text: "Change made!",
          icon: "success",
          buttons: {
            ok: "OK"
          }
        } as any)
      });
  }

  visitors: Observable<Visitor[]>;

  getVisitors() {
    this.visitors = this.afs.collection('visitors').valueChanges();
    return this.visitors;
  }

  flagVisitor(id: string, reason: string) {
    this.afAuth.authState.toPromise()
      .then(user => {
        this.afs.collection('staffs', ref => ref.where('email', '==', user.email)).get().toPromise()
          .then(snapshot => {
            snapshot.forEach(doc => {
              const staffName = doc.data().sFirstName + " " + doc.data().sFirstName;
              this.afs.collection('visitors').doc(id).get().toPromise()
              .then((doc) => {
                let flags: Flag[] = doc.data().flags;
                const date = new Date();
                const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
                  + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
                  + date.getFullYear();
                flags.unshift(new Flag(dateStr, staffName, reason));
                this.afs.collection('visitors').doc(id).update({flags: flags});
                swal("Visitor flagged!", {
                  icon: "success",
                })
              });
            })
          })
      })
  }

  ratings: Observable<Rating>;

  getRatings() {
    this.ratings = this.afs.collection('ratings').doc('ratings').valueChanges();
    return this.ratings;
  }

  feedbacks: Observable<Feedback[]>;

  getFeedbacks() {
    this.feedbacks = this.afs.collection('feedbacks').valueChanges();
    return this.feedbacks;
  }
}
