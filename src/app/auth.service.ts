import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import swal from 'sweetalert';
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
        const email = res.email;
        this.afs.collection('users', ref => ref.where('email', '==', email)).get().toPromise()
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
                this.router.navigate(['/', userType]);
              }
            })
            .catch(error => {this.swalWrongIdOrPassword()});
        } else {
          this.swalWrongIdOrPassword();
        }
      })
      .catch(error => {this.swalWrongIdOrPassword()});
  }

  private swalWrongIdOrPassword() {
    swal({
      title: "Error!",
      text: "Wrong ID or Password!",
      icon: "error",
      buttons: {
        ok: "OK"
      }
    } as any);
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
    /* if(Check in the deleted-users collection){
      const users: AngularFirestoreCollection<User> = this.afs.collection('users');
      users.doc(id).set(new User(id, email, userType));
      const idList: AngularFirestoreCollection<IDList> = this.afs.collection('id-list');
      idList.doc(id).set(new IDList(id));

      this.afAuth.auth.sendPasswordResetEmail(email);
    } else {
      const password = randomPassword();
      
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
        const users: AngularFirestoreCollection<User> = this.afs.collection('users');
        users.doc(id).set(new User(id, email, userType));
        const idList: AngularFirestoreCollection<IDList> = this.afs.collection('id-list');
        idList.doc(id).set(new IDList(id));

        //Send an email with the id and new password
      });
      console.log(password)
    } */
  }

  deleteUser(id: string) {
    this.afs.collection('users', ref => ref.where('id', '==', id)).get().toPromise()
      .then(snapshot => {
        if(snapshot.docs.length == 0) {
          //error
        }
        else {
          this.afs.collection('users').doc(id).delete();
          this.afs.collection('id-list').doc(id).delete();
        }
      })
  }

}

