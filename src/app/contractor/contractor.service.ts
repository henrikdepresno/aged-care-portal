import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { Contractor, Feedback } from '../classes';
import { take } from 'rxjs/operators';

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

  provideFeedback(contractorId: string, willProvide: boolean, cName?: string, email?: string, title?: string, context?: string) {
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
        const feedback = new Feedback(newId, title, cName, email, 'Contractor', dateStr, context);
        this.afs.collection('feedbacks').doc(newId).set(Object.assign({}, feedback))
      })
      Swal.fire({
        title: "Submitted!",
        html: "Thanks for the feedback!",
        type: 'success'
      })
    }
    this.afs.collection('contractors').doc(contractorId).update({justCheckOut: false})
  }
}
