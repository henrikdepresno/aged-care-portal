import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Resident, Contractor, Staff, IDList, Visitor, Flag, Rating, Feedback, ResidentAdd } from '../classes';
import { capitalize, randomUniqueID } from '../functions';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  // For all components

  getCurrentVisitors() {
    return this.afs.collection('visitors', ref => ref.where('inFacility', '==', true)).get();
  }

  getCurrentContractors() {
    return this.afs.collection('contractors', ref => ref.where('inFacility', '==', true)).get();
  }

  private updateIdSource = new BehaviorSubject<string>("");
  updateId = this.updateIdSource.asObservable();

  passUpdateId(id: string) {
    this.updateIdSource.next(id);
  }

  successAddUser(userType: string) {
    Swal.fire({
      title: "Success!",
      text: `${capitalize(userType)} added`,
      type: 'success'
    })
    .then(() => {
      this.router.navigate(['/admin', `${userType}-view`]);
    })
  }

  emailInUse() {
    Swal.fire({
      title: "Error!",
      text: "Email is already in use!",
      type: 'error'
    })
  }

  // Contractor Functions

  contractorsCollection: AngularFirestoreCollection<Contractor>;
  contractors: Observable<Contractor[]>;

  getContractors() {
    this.contractors = this.afs.collection('contractors').valueChanges();
    return this.contractors;
  }

  addContractor(cFirstName: string, cLastName: string, email: string, phone: string, companyName: string, field: string) {
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      this.afs.collection('users').get().toPromise().then(userSnapshot => {
        let emails = [];
        userSnapshot.docs.forEach(doc => {
          emails.push(doc.data().email);
        })
        if(!emails.includes(email)) {
          const newID = randomUniqueID(idSnapshot);
          this.contractorsCollection = this.afs.collection('contractors');
          const contractor = new Contractor(newID, cFirstName, cLastName, phone, email, companyName, field, false, false)
          this.contractorsCollection.doc(newID).set(Object.assign({}, contractor));
          this.authService.addUser(newID, email, 'contractor', cFirstName);
          this.successAddUser('contractor');
        }
        else {
          this.emailInUse();
        }
      })
    })
  }

  updateContractor(id: string, cFirstName: string, cLastName: string, phone: string, companyName: string, field: string) {
    if(cFirstName != "") this.afs.collection('contractors').doc(id).update({cFirstName: cFirstName});
    if(cLastName != "") this.afs.collection('contractors').doc(id).update({cLastName: cLastName});
    if(phone != "") this.afs.collection('contractors').doc(id).update({phone: phone});
    if(companyName != "") this.afs.collection('contractors').doc(id).update({companyName: companyName});
    if(field != "") this.afs.collection('contractors').doc(id).update({field: field});
  }

  deleteContractor(id: string) {
    this.afs.collection('contractors').doc(id).delete();
    this.authService.deleteUser(id);
  }

  // Staff Functions

  staffsCollection: AngularFirestoreCollection<Staff>;
  staffs: Observable<Staff[]>;

  getStaffs() {
    this.staffs = this.afs.collection('staffs').valueChanges();
    return this.staffs;
  }

  addStaff(sFirstName: string, sLastName: string, email: string, phone: string, role: string) {
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      this.afs.collection('users').get().toPromise().then(userSnapshot => {
        let emails = [];
        userSnapshot.docs.forEach(doc => {
          emails.push(doc.data().email);
        })
        if(!emails.includes(email)) {
          const newID = randomUniqueID(idSnapshot);
          this.staffsCollection = this.afs.collection('staffs');
          const staff = new Staff(newID, sFirstName, sLastName, phone, email, role)
          this.staffsCollection.doc(newID).set(Object.assign({}, staff));
          this.authService.addUser(newID, email, 'staff', sFirstName);
          this.successAddUser('staff');
        }
        else {
          this.emailInUse();
        }
      })
    })
  }

  updateStaff(id: string, sFirstName: string, sLastName: string, phone: string, role: string) {
    if(sFirstName != "") this.afs.collection('staffs').doc(id).update({sFirstName: sFirstName});
    if(sLastName != "") this.afs.collection('staffs').doc(id).update({sLastName: sLastName});
    if(phone != "") this.afs.collection('staffs').doc(id).update({phone: phone});
    if(role != "") this.afs.collection('staffs').doc(id).update({role: role});
  }

  deleteStaff(id: string) {
    this.afs.collection('staffs').doc(id).delete();
    this.authService.deleteUser(id);
  }

  // Resident Functions

  residentsAddCollection: AngularFirestoreCollection<ResidentAdd>;
  residents: Observable<Resident[]>;

  getResidents() {
    this.residents = this.afs.collection('residents').valueChanges();
    return this.residents;
  }

  addResident(rFirstName: string, rLastName: string, phone: string) {
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      const newID = randomUniqueID(idSnapshot);
      this.residentsAddCollection = this.afs.collection('residents');
      const resident = new ResidentAdd(newID, rFirstName, rLastName, phone)
      this.residentsAddCollection.doc(newID).set(Object.assign({}, resident));
      this.residentsAddCollection.doc(newID).update({schedule:{
        0: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        },
        1: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        },
        2: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        },
        3: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        },
        4: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        },
        5: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        },
        6: {
          7: {available: false, activity: "Sleep"}, 8: {available: false, activity: "Waking up"},
          9: {available: false, activity: "Breakfast"}, 10: {available: true, activity: ""},
          11: {available: true, activity: ""}, 12: {available: true, activity: ""},
          13: {available: false, activity: "Lunch"}, 14: {available: true, activity: ""},
          15: {available: true, activity: ""}, 16: {available: true, activity: ""},
          17: {available: true, activity: ""}, 18: {available: false, activity: "Dinner"},
          19: {available: true, activity: ""}, 20: {available: true, activity: ""},
          21: {available: false, activity: "Evening snack"}, 22: {available: false, activity: "Sleep"},
        }
      }});
      const newId = new IDList(newID);
      this.afs.collection('id-list').doc(newID).set(Object.assign({}, newId));
      this.router.navigate(['/admin', 'resident-view']);
    })
  }

  updateResident(id: string, rFirstName: string, rLastName: string, phone: string) {
    if(rFirstName != "") this.afs.collection('residents').doc(id).update({rFirstName: rFirstName});
    if(rLastName != "") this.afs.collection('residents').doc(id).update({rLastName: rLastName});
    if(phone != "") this.afs.collection('residents').doc(id).update({phone: phone});
  }

  deleteResident(id: string) {
    this.afs.collection('residents').doc(id).delete();
    this.afs.collection('id-list').doc(id).delete();

    const visitorCollection: AngularFirestoreCollection<Visitor> = this.afs.collection('visitors');
    visitorCollection.valueChanges().pipe(take(1))
    .subscribe(visitors => {
      visitors.forEach(visitor => {
        let residentIds = visitor.residentIds.filter((value) => {return value != id});
        this.afs.collection('bookings', ref => ref.where('residentId', '==', id)).get().toPromise()
        .then(bookingSnapshots => {
          let bookingIds = visitor.bookingIds;
          bookingSnapshots.forEach(doc => {
            bookingIds = bookingIds.filter((value) => {return value != doc.id});
            this.afs.collection('bookings').doc(doc.id).delete();
          })
          this.afs.collection('visitors').doc(visitor.id).update({
            residentIds: residentIds,
            bookingIds: bookingIds
          });
        })
      })
    })
  }

  // Visitor Functions

  visitorsCollection: AngularFirestoreCollection<Visitor>;
  visitors: Observable<Visitor[]>;
  visitor: Observable<Visitor>;

  getVisitors() {
    this.visitors = this.afs.collection('visitors').valueChanges();
    return this.visitors;
  }

  getVisitor(id: string) {
    this.visitor = this.afs.collection('visitors').doc(id).valueChanges();
    return this.visitor;
  }

  clearFlag(flags: Flag[], index: number, id: string) {
    flags.splice(index, 1);
    this.afs.collection('visitors').doc(id).update({flags: JSON.parse(JSON.stringify(flags))})
    .then(() => {
      Swal.fire({
        title: "Success!",
        text: "Flag cleared!",
        type: 'success'
      })
      this.router.navigate(['/admin', 'visitor-view'])
    });
  }

  updateVisitor(id: string, vFirstName: string, vLastName: string, phone: string) {
    if(vFirstName != "") this.afs.collection('visitors').doc(id).update({vFirstName: vFirstName});
    if(vLastName != "") this.afs.collection('visitors').doc(id).update({vLastName: vLastName});
    if(phone != "") this.afs.collection('visitors').doc(id).update({phone: phone});
  }

  // Feedback Functions

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
