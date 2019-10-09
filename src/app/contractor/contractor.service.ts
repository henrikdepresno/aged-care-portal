import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
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

  /* ALL Component Functions */

  // Get the Firebase Auth state of logged contractor
  getAuthState() {
    return this.afAuth.authState;
  }

  // Get the query snapshot to pass into the getIdFromEmailQuerySnapshot() function
  getQuerySnapshotByEmail(email: string, userType: string) {
    // Query from the collection corresponding to user type (contractor)
    return this.afs.collection(userType + 's', ref => ref.where('email', '==', email)).get();
  }

  // Get the contractor ID form the query snapshot
  getIdFromEmailQuerySnapshot(snapshot) {
    let id = ''
    snapshot.forEach(doc => {
      id = doc.id;
    })
    return id;
  }

  /* ACCOUNT Functions */

  // Update the info of the logged contractor
  updateDetails(id: string, phone: string) {
    if(phone != "") this.afs.collection('contractors').doc(id).update({phone: phone});
  }

  /* FEEDBACK Functions */

  // Get the logged contractor's info by ID
  getContractorById(id: string) {
    const contractorDoc: AngularFirestoreDocument<Contractor> = this.afs.collection('contractors').doc(id);
    return contractorDoc.valueChanges();
  }

  // Add a feedback in the Firestore
  provideFeedback(contractorId: string, willProvide: boolean, cName?: string, email?: string, title?: string, context?: string) {
    // If the contractor is willing to provide, create a feedback object
    // Else, skip the adding
    if(willProvide) {
      // Getting all of the previous feedbacks
      let feedbackCollections: AngularFirestoreCollection<Feedback> = this.afs.collection('feedbacks')
      feedbackCollections.valueChanges().pipe(take(1))
      .subscribe(feedbacks => {
        // Generate an appropriate feedback ID (8 digits starting from 00000001)
        let newId = ''
        if(feedbacks.length != 0) { // If there are feedbacks in Firestore
          const latestId = feedbacks[feedbacks.length - 1].id;
          // New feedback ID = Old feedback ID + 1
          const newIdStr = (parseInt(latestId) + 1).toString();
          newId = '00000000'.substring(0, 8 - newIdStr.length) + newIdStr
        }
        else { // If there are no feedbacks in Firestore
          newId = '00000001'
        }
        // Add into the 'feedback' collection
        const date = new Date();
        const dateStr = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/"
        + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/"
        + date.getFullYear();
        const feedback = new Feedback(newId, title, cName, email, 'Contractor', dateStr, context);
        this.afs.collection('feedbacks').doc(newId).set(Object.assign({}, feedback))
      })
      // Return a success alert
      Swal.fire({
        title: "Submitted!",
        html: "Thanks for the feedback!",
        type: 'success'
      })
    }
    // Providing feedback or not, either way stop the asking loop
    this.afs.collection('contractors').doc(contractorId).update({justCheckOut: false})
  }
}
