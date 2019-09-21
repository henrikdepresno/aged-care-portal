import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert';
import { EmailService } from './email.service';
import { randomUniqueID, randomPassword } from './functions';
import { User, IDList, Visitor } from './classes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient,
    private emailService: EmailService
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

  registerVisitor(email: string, password: string, vFirstName: string, vLastName: string, phone: string,  rFirstName: string, rLastName: string) {
    this.afs.collection('residents', ref =>
      ref.where('rFirstName', '==', rFirstName).where('rLastName', '==', rLastName)).get().toPromise()
      .then(snapshot => {
        if(snapshot.docs.length != 0) {
          this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
            const newID = randomUniqueID(idSnapshot);
            const visitor = new Visitor(newID, vFirstName, vLastName, email, phone, [snapshot.docs[0].id], [], [], false, false);
            this.afs.collection('visitors').doc(newID).set(Object.assign({}, visitor));
            this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
              const user = new User(newID, email, 'visitor');
              this.afs.collection('users').doc(newID).set(Object.assign({}, user));
              const newId = new IDList(newID);
              this.afs.collection('id-list').doc(newID).set(Object.assign({}, newId));
              this.emailService.emailNewAccount(email, newID, vFirstName, 'visitor');
              swal({
                title: "Account created!",
                text: "Your new ID has been sent to your email!",
                icon: "success",
                buttons: {
                  ok: "Login"
                }
              } as any)
              .then(() => {
                this.router.navigate(['/login', 'login-v'])
              });
            });
          })
        }
        else {
          swal({
            title: "Error!",
            text: "No residents found!",
            icon: "error",
            buttons: {
              ok: "OK"
            }
          } as any);
        }
      })
  }

  addUser(id: string, email: string, userType: string, firstName: string) {
    const password = randomPassword();
    const data = {
      email: email,
      password: password
    }
    this.http.post("http://localhost:3000/add-auth-user-fb", data).subscribe();
    const user = new User(id, email, userType);
    this.afs.collection('users').doc(id).set(Object.assign({}, user));
    const newId = new IDList(id);
    this.afs.collection('id-list').doc(id).set(Object.assign({}, newId));

    this.emailService.emailNewAccount(email, id, firstName, userType, password);
  }

  deleteUser(id: string) {
    this.afs.collection('users', ref => ref.where('id', '==', id)).get().toPromise()
      .then(snapshot => { snapshot.forEach(doc => { 
        const data = {
          email: doc.data().email
        }
        this.http.post("http://localhost:3000/delete-auth-user-fb", data).subscribe();
        this.afs.collection('users').doc(id).delete();
        this.afs.collection('id-list').doc(id).delete();
      })});
  }
}
