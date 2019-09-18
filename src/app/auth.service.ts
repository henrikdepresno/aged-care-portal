import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { randomUniqueID, randomPassword } from './functions';
import { User, IDList } from './classes-input';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  checkUserType() {
    this.afAuth.authState.subscribe(res => {
      if(res != null){
        const uid = res.uid;
        this.afs.collection('users', ref => ref.where('uid', '==', uid)).get().toPromise()
          .then(snapshot => {
            snapshot.forEach(doc => { 
              const afAuthUserType: string = doc.data().userType;
              const routerUserType: string = this.router.url.substr(1, afAuthUserType.length);
              if(afAuthUserType != routerUserType){
                this.router.navigate(['/404']);
              }
            })
          })
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  navigateToHome(loginCompInit: boolean) {
    this.afAuth.authState.subscribe(res => {
      if(res != null){
        const uid = res.uid;
        this.afs.collection('users', ref => ref.where('uid', '==', uid)).get().toPromise()
          .then(snapshot => {
            snapshot.forEach(doc => { 
              const afAuthUserType: string = doc.data().userType;
              if(afAuthUserType == 'admin'){
                this.router.navigate(['/admin']);
              }
              else if(afAuthUserType == 'contractor'){
                this.router.navigate(['/contractor']);
              }
              else if(afAuthUserType == 'staff'){
                this.router.navigate(['/staff']);
              }
              else if(afAuthUserType == 'visitor'){
                this.router.navigate(['/visitor']);
              }
            })
          })
      } else {
        if(!loginCompInit){
          this.router.navigate(['/login']);
        }
      }
    });
  }

  login(id: string, password: string, userType: string) {
    this.afs.collection('users').doc(id).get().toPromise()
      .then((res) => {
        if(res.data().userType == userType) {
          this.afAuth.auth.signInWithEmailAndPassword(res.data().email, password)
            .then(userCredential => {
              if(userCredential) {
                this.router.navigate(['/admin']);
              }
            })
            .catch(error => {console.log(error)});
        } else {
          console.log("ERROR");
        }
      })
      .catch(error => {console.log(error)});
  }

  logOut() {
    this.afAuth.auth.signOut();
  }

  registerVisitor(/*vFirstName: string, vLastName: string, phone: string, email: string,*/ rFirstName: string, rLastName: string) {
    this.afs.collection('residents-query', ref =>
      ref.where('rFirstName', '==', rFirstName).where('rLastName', '==', rLastName)).get().toPromise()
      .then(snapshot => {
        if(snapshot.docs.length != 0) {
          this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
            const newID = randomUniqueID(idSnapshot);
            console.log(newID);
          })
        }
        else {
          console.log("NOT FOUND");
        }
      })
  }

  addUser(id: string, email: string, userType: string) {
    const password = randomPassword();
    
    
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const users: AngularFirestoreCollection<User> = this.afs.collection('users');
      users.doc(id).set(new User(id, userCredential.user.uid, email, userType));
      const idList: AngularFirestoreCollection<IDList> = this.afs.collection('id-list');
      idList.doc(id).set(new IDList(id));
    });
    console.log(password)
  }

  deleteUser(id: string) {

  }

}

