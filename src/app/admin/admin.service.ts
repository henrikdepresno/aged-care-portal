import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Resident, Contractor, Staff, IDList } from '../classes';
import { VisitorView, Feedback, Flag } from '../classes-output';
import { randomUniqueID } from '../functions';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  getCurrentVisitorNumber(): number {
    const num = 10;
    return num;
  }

  private updateIdSource = new BehaviorSubject<string>("");
  updateId = this.updateIdSource.asObservable();

  passUpdateId(id: string) {
    this.updateIdSource.next(id);
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
      const newID = randomUniqueID(idSnapshot);
      this.contractorsCollection = this.afs.collection('contractors');
      const contractor = new Contractor(newID, cFirstName, cLastName, phone, email, companyName, field)
      this.contractorsCollection.doc(newID).set(Object.assign({}, contractor));
      this.authService.addUser(newID, email, 'contractor', cFirstName);
      this.router.navigate(['/admin', 'contractor-view']);
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
      const newID = randomUniqueID(idSnapshot);
      this.staffsCollection = this.afs.collection('staffs');
      const staff = new Staff(newID, sFirstName, sLastName, phone, email, role)
      this.staffsCollection.doc(newID).set(Object.assign({}, staff));
      this.authService.addUser(newID, email, 'staff', sFirstName);
      this.router.navigate(['/admin', 'staff-view']);
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

  residentsCollection: AngularFirestoreCollection<Resident>;
  residents: Observable<Resident[]>;

  getResidents() {
    this.residents = this.afs.collection('residents').valueChanges();
    return this.residents;
  }

  addResident(rFirstName: string, rLastName: string, phone: string) {
    this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
      const newID = randomUniqueID(idSnapshot);
      this.residentsCollection = this.afs.collection('residents');
      const resident = new Resident(newID, rFirstName, rLastName, phone)
      this.residentsCollection.doc(newID).set(Object.assign({}, resident));
      this.residentsCollection.doc(newID).update({schedule:{
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
  }

  getVisitorViews(): VisitorView[] {
    const visitorViews: VisitorView[] = [
      new VisitorView("Arian", "Jacobson", false),
      new VisitorView("Jadene", "Kane", false),
      new VisitorView("Ida", "Esquivel", false),
      new VisitorView("Carmel", "Conway", false),
      new VisitorView("Nusaybah", "Horne", false),
      new VisitorView("Mekhi", "Diaz", true),
      new VisitorView("Rudi", "Betts", false),
      new VisitorView("Arjan", "Forbes", false),
      new VisitorView("Arman", "Haigh", false),
      new VisitorView("Md", "Cannon", true),
      new VisitorView("Gabriela", "Coles", false),
      new VisitorView("Micheal", "Davey", true),
      new VisitorView("Jeremy", "Whelan", false),
      new VisitorView("Danyal", "Carter", false),
      new VisitorView("Taybah", "Jaramillo", false),
      new VisitorView("Tasha", "Wilks", true),
      new VisitorView("Menna", "Chaney", false),
      new VisitorView("Tania", "Kirkland", false),
      new VisitorView("Vikki", "Ellis", false),
      new VisitorView("Saxon", "Oneil", false)
    ];
    return visitorViews;
  }

  getRatings(): number[] {
    const one = 4;
    const two = 3;
    const three = 5;
    const four = 15;
    const five = 23;
    return [one, two, three, four, five];
  }

  getFeedbacks(): Feedback[] {
    const feedbacks: Feedback[] = [
      new Feedback("Bad Ventilation", "Arian", "Jacobson", "Visitor", new Date(2019, 6, 12, 14, 0, 0), ""),
      new Feedback("Rude Staff!", "Arjan", "Forbes", "Visitor", new Date(2019, 6, 10, 14, 0, 0), ""),
      new Feedback("Lovely place", "Arman", "Haigh", "Visitor", new Date(2019, 6, 5, 14, 0, 0), ""),
      new Feedback("great service", "Dixon", "Hills", "Contractor", new Date(2019, 5, 23, 14, 0, 0), ""),
      new Feedback("Helpful staff!", "Saxon", "Oneil", "Visitor", new Date(2019, 5, 21, 14, 0, 0), "")
    ];
    return feedbacks;
  }

  getFlags(): Flag[] {
    const flags: Flag[] = [
      new Flag(new Date(2019, 6, 12, 14, 0, 0), "Dalia Walls", "")
    ];
    return flags;
  }
}
