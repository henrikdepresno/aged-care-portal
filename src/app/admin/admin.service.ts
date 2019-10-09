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

  /* ALL Components Functions */

  // Get the number of current visitors in the facility
  getCurrentVisitors() {
    return this.afs.collection('visitors', ref => ref.where('inFacility', '==', true)).get();
  }

  // Get the number of current contractors in the facility
  getCurrentContractors() {
    return this.afs.collection('contractors', ref => ref.where('inFacility', '==', true)).get();
  }

  // Passing ID between components when updating a user's info
  private updateIdSource = new BehaviorSubject<string>("");
  updateId = this.updateIdSource.asObservable();
  passUpdateId(id: string) {
    this.updateIdSource.next(id);
  }

  // Return a success alert when successfully adding a user and navigate to the corresponding view component
  private successAddUser(userType: string) {
    Swal.fire({
      title: "Success!",
      html: `${capitalize(userType)} added`,
      type: 'success'
    })
    .then(() => {
      this.router.navigate(['/admin', `${userType}-view`]);
    })
  }

  // Return a error alert when the email is already exists in the Firebase
  emailInUse() {
    Swal.fire({
      title: "Error!",
      html: "Email is already in use!",
      type: 'error'
    })
  }

  /* CONTRACTOR Functions */

  // Get all the contractors in the Firestore
  contractorsCollection: AngularFirestoreCollection<Contractor>;
  contractors: Observable<Contractor[]>;
  getContractors() {
    this.contractors = this.afs.collection('contractors').valueChanges();
    return this.contractors;
  }

  // Add a new contractor
  addContractor(cFirstName: string, cLastName: string, email: string, phone: string, companyName: string, field: string) {
    // Get all IDs in the Firestore
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      this.afs.collection('users').get().toPromise().then(userSnapshot => {
        // Get all existed emails in Firestore
        let emails = [];
        userSnapshot.docs.forEach(doc => {
          emails.push(doc.data().email);
        })
        if(!emails.includes(email)) { // If the new email is not in use
          // Get a new ID that is unique from the IDs in the Firestore
          const newID = randomUniqueID(idSnapshot);
          // Create a new Contractor object, convert it to a JS object and add it to 'contractors' collection
          this.contractorsCollection = this.afs.collection('contractors');
          const contractor = new Contractor(newID, cFirstName, cLastName, phone, email, companyName, field, false, false)
          this.contractorsCollection.doc(newID).set(Object.assign({}, contractor));
          // Add into the 'users' and 'id-list' collections
          this.authService.addUser(newID, email, 'contractor', cFirstName);
          // Return a success alert
          this.successAddUser('contractor');
        }
        else { // If the new email is in use
          // Return an error alert
          this.emailInUse();
        }
      })
    })
  }

  // Update a contractor's info in Firestore
  updateContractor(id: string, cFirstName: string, cLastName: string, phone: string, companyName: string, field: string) {
    if(cFirstName != "") this.afs.collection('contractors').doc(id).update({cFirstName: cFirstName});
    if(cLastName != "") this.afs.collection('contractors').doc(id).update({cLastName: cLastName});
    if(phone != "") this.afs.collection('contractors').doc(id).update({phone: phone});
    if(companyName != "") this.afs.collection('contractors').doc(id).update({companyName: companyName});
    if(field != "") this.afs.collection('contractors').doc(id).update({field: field});
  }

  // Delete a contractor
  deleteContractor(id: string) {
    // Delete from 'contractors' collection
    this.afs.collection('contractors').doc(id).delete();
    // Delete from 'users' and 'id-list' collections
    this.authService.deleteUser(id);
  }

  /* STAFF Functions */

  // Get all the staffs in the Firestore
  staffsCollection: AngularFirestoreCollection<Staff>;
  staffs: Observable<Staff[]>;
  getStaffs() {
    this.staffs = this.afs.collection('staffs').valueChanges();
    return this.staffs;
  }

  // Add a new staff
  addStaff(sFirstName: string, sLastName: string, email: string, phone: string, role: string) {
    // Get all IDs in the Firestore
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      this.afs.collection('users').get().toPromise().then(userSnapshot => {
        // Get all existed emails in Firestore
        let emails = [];
        userSnapshot.docs.forEach(doc => {
          emails.push(doc.data().email);
        })
        if(!emails.includes(email)) { // If the new email is not in use
          // Get a new ID that is unique from the IDs in the Firestore
          const newID = randomUniqueID(idSnapshot);
          // Create a new Staff object, convert it to a JS object and add it to 'staffs' collection
          this.staffsCollection = this.afs.collection('staffs');
          const staff = new Staff(newID, sFirstName, sLastName, phone, email, role)
          this.staffsCollection.doc(newID).set(Object.assign({}, staff));
          // Add into the 'users' and 'id-list' collections
          this.authService.addUser(newID, email, 'staff', sFirstName);
          // Return a success alert
          this.successAddUser('staff');
        }
        else { // If the new email is in use
          // Return an error alert
          this.emailInUse();
        }
      })
    })
  }

  // Update a staff's info in Firestore
  updateStaff(id: string, sFirstName: string, sLastName: string, phone: string, role: string) {
    if(sFirstName != "") this.afs.collection('staffs').doc(id).update({sFirstName: sFirstName});
    if(sLastName != "") this.afs.collection('staffs').doc(id).update({sLastName: sLastName});
    if(phone != "") this.afs.collection('staffs').doc(id).update({phone: phone});
    if(role != "") this.afs.collection('staffs').doc(id).update({role: role});
  }

  // Delete a staff
  deleteStaff(id: string) {
    // Delete from 'staffs' collection
    this.afs.collection('staffs').doc(id).delete();
    // Delete from 'users' and 'id-list' collections
    this.authService.deleteUser(id);
  }

  /* RESIDENT Functions */

  // Get all the residents in the Firestore
  residentsAddCollection: AngularFirestoreCollection<ResidentAdd>;
  residents: Observable<Resident[]>;
  getResidents() {
    this.residents = this.afs.collection('residents').valueChanges();
    return this.residents;
  }

  // Add a new resident
  addResident(rFirstName: string, rLastName: string, phone: string) {
    // Get all IDs in the Firestore
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      // Get a new ID that is unique from the IDs in the Firestore
      const newID = randomUniqueID(idSnapshot);
      // Create a new ResidentAdd object, convert it to a JS object and add it to 'residents' collection
      this.residentsAddCollection = this.afs.collection('residents');
      const resident = new ResidentAdd(newID, rFirstName, rLastName, phone)
      this.residentsAddCollection.doc(newID).set(Object.assign({}, resident));
      // Update the resident with a sample new 'schedule' nested object
      /*
      7AM: Sleep, 8AM: Waking up, 9AM: Breakfast, 10AM: Available,
      11AM: Available, 12PM: Available, 1PM: Lunch, 2PM: Available,
      3PM: Available, 4PM: Available, 5PM: Available, 6PM: Dinner,
      7PM: Available, 8PM: Available, 9PM: Evening snack, 10PM: Sleep
      (Loop for all 7 days of the week)
      */
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
      // Add into the 'id-list' collection
      const newId = new IDList(newID);
      this.afs.collection('id-list').doc(newID).set(Object.assign({}, newId));

      this.router.navigate(['/admin', 'resident-view']);
    })
  }

  // Update a resident's info in Firestore
  updateResident(id: string, rFirstName: string, rLastName: string, phone: string) {
    if(rFirstName != "") this.afs.collection('residents').doc(id).update({rFirstName: rFirstName});
    if(rLastName != "") this.afs.collection('residents').doc(id).update({rLastName: rLastName});
    if(phone != "") this.afs.collection('residents').doc(id).update({phone: phone});
  }

  // Delete a resident
  deleteResident(id: string) {
    // Delete from 'residents' and 'id-list' collections
    this.afs.collection('residents').doc(id).delete();
    this.afs.collection('id-list').doc(id).delete();

    // Search for all the resident IDs in all visitors' resident IDs arrays which match the deleted resident's ID
    // And remove all of those and the bookings related to them
    const visitorCollection: AngularFirestoreCollection<Visitor> = this.afs.collection('visitors');
    visitorCollection.valueChanges().pipe(take(1))
    .subscribe(visitors => {
      // Loop through all the visitors in Firestore
      visitors.forEach(visitor => {
        // Filter out the matching resident ID from the visitor's resident IDs array
        let residentIds = visitor.residentIds.filter((value) => {return value != id});
        this.afs.collection('bookings', ref => ref.where('residentId', '==', id)).get().toPromise()
        .then(bookingSnapshots => {
          let bookingIds = visitor.bookingIds;
          // Delete the bookings which are related to that resident in both 'bookings' and 'visitors' collection
          bookingSnapshots.forEach(doc => {
            bookingIds = bookingIds.filter((value) => {return value != doc.id});
            this.afs.collection('bookings').doc(doc.id).delete();
          })
          // Update the visitor filtered booking and resident IDs arrays
          this.afs.collection('visitors').doc(visitor.id).update({
            residentIds: residentIds,
            bookingIds: bookingIds
          });
        })
      })
    })
  }

  /* VISITOR Functions */

  // Get all the visitors in the Firestore
  visitorsCollection: AngularFirestoreCollection<Visitor>;
  visitors: Observable<Visitor[]>;
  getVisitors() {
    this.visitors = this.afs.collection('visitors').valueChanges();
    return this.visitors;
  }

  // Get a specific visitor in Firestore
  visitor: Observable<Visitor>;
  getVisitor(id: string) {
    this.visitor = this.afs.collection('visitors').doc(id).valueChanges();
    return this.visitor;
  }

  // Clear a predefined flag in a visitor's flag array
  clearFlag(flags: Flag[], index: number, id: string) {
    flags.splice(index, 1);
    this.afs.collection('visitors').doc(id).update({flags: JSON.parse(JSON.stringify(flags))})
    .then(() => {
      // Return a success alert
      Swal.fire({
        title: "Success!",
        html: "Flag cleared!",
        type: 'success'
      })
      this.router.navigate(['/admin', 'visitor-view'])
    });
  }

  // Update a visitor's info in Firestore
  updateVisitor(id: string, vFirstName: string, vLastName: string, phone: string) {
    if(vFirstName != "") this.afs.collection('visitors').doc(id).update({vFirstName: vFirstName});
    if(vLastName != "") this.afs.collection('visitors').doc(id).update({vLastName: vLastName});
    if(phone != "") this.afs.collection('visitors').doc(id).update({phone: phone});
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
