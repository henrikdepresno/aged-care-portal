import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

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

  passId(id: string) {
    this.idSource.next(id);
  }

  getId() {
    this.afAuth.authState.toPromise()
      .then(user => {
        this.afs.collection('users', ref => ref.where('email', '==', user.email)).get().toPromise()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.passId(doc.id);
            })
          })
      })
  }

  updateDetails(id: string, phone: string) {
    if(phone != "") this.afs.collection('contractors').doc(id).update({phone: phone});
  }
}
