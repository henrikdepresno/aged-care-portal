import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Contractor } from '../classes';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  private idSource = new BehaviorSubject<string>("");
  id = this.idSource.asObservable();

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

  getContractorById(id: string) {
    const contractorDoc: AngularFirestoreDocument<Contractor> = this.afs.collection('contractors').doc(id);
    return contractorDoc.valueChanges();
  }

  updateDetails(id: string, phone: string) {
    if(phone != "") this.afs.collection('contractors').doc(id).update({phone: phone});
  }
}
