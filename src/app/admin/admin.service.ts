import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Resident, Contractor } from '../classes-input';
import { StaffView, VisitorView, Feedback, Flag } from '../classes-output';
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

  private updateIdSource = new BehaviorSubject<string>("");
  updateId = this.updateIdSource.asObservable();

  passUpdateId(id: string) {
    this.updateIdSource.next(id);
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

  getStaffViews(): StaffView[] {
    const staffViews: StaffView[] = [
      new StaffView("Manahil", "Maguire"),
      new StaffView("Dalia", "Walls"),
      new StaffView("Ricardo", "Wynn"),
      new StaffView("Abdullahi", "Bates"),
      new StaffView("Sienna", "Frazier"),
      new StaffView("Kyron", "Frank"),
      new StaffView("Issa", "Rigby"),
      new StaffView("Isla-Rae", "Hudson"),
      new StaffView("Anya", "Perkins"),
      new StaffView("Kaine", "Woolley")
    ];
    return staffViews;
  }

  residentsCollection: AngularFirestoreCollection<Resident>;
  residents: Observable<Resident[]>;

  getResidents() {
    this.residents = this.afs.collection('residents').valueChanges();
    return this.residents;
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
      new Flag(new Date(2019, 6, 12, 14, 0, 0), new StaffView("Dalia", "Walls"), "")
    ];
    return flags;
  }
}
