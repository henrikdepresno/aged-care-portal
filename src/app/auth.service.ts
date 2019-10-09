import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { EmailService } from './email.service';
import { randomUniqueID, randomPassword } from './functions';
import { User, IDList, Visitor } from './classes';
import { forkJoin } from 'rxjs'

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

  // Check for the logged user type
  // Navigate the users back to 404 if they try to access a predefined path but not within their access permit
  // Example: A visitor tries to access an admin component will be navigated back to 404
  checkUserType() {
    this.afAuth.authState
      .subscribe(user => {
        if(user != null) { // If the user is logged in
          // Using the Firebase Auth state, search for a user in the Firestore with the same email
          this.afs.collection('users', ref => ref.where('email', '==', user.email)).get().toPromise()
            .then(snapshot => {
              snapshot.forEach(doc => { 
                // Get the current logged user type from Firestore
                const afAuthUserType: string = doc.data().userType;
                // Get the current component access level (component's user type)
                const routerUserType: string = this.router.url.substr(1, afAuthUserType.length);
                // Compare the logged user type with the component access level
                if(afAuthUserType != routerUserType){
                  this.router.navigate(['/404']);
                }
              })
            })
        } else { // If the user is not logged in
          this.router.navigate(['/404']);
        }
    });
  }

  // Navigate back to the homepage
  // Homepage is changed depending on the logged user type
  // If the user is not logged in, the homepage is the login component
  // 'loginCompInit' = true if the function is called when the login component initializes
  navigateToHome(loginCompInit: boolean) {
    this.afAuth.authState.subscribe(res => {
      if(res != null) { // If the user is logged in
        // Using the Firebase Auth state, search for a user in the Firestore with the same email
        this.afs.collection('users', ref => ref.where('email', '==', res.email)).get().toPromise()
          .then(snapshot => {
            snapshot.forEach(doc => { 
              // Get the current logged user type from Firestore
              const afAuthUserType: string = doc.data().userType;
              if(afAuthUserType == 'admin') {
                this.router.navigate(['/admin']);
              }
              else if(afAuthUserType == 'contractor') {
                this.router.navigate(['/contractor']);
              }
              else if(afAuthUserType == 'staff') {
                this.router.navigate(['/staff']);
              }
              else if(afAuthUserType == 'visitor') {
                this.router.navigate(['/visitor']);
              }
            })
          })
      } else { // If the user is not logged in
        if(!loginCompInit) { // Stop the login components from a homepage navigation loop
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // Login using Firebase Auth (Email and Password Verification)
  // Find the email in Firestore corresponding to the input ID
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
            // Wrong password
            .catch(error => {this.swalWrongIdOrPassword()});
        } else {
          // ID exists but wrong login component's user type
          this.swalWrongIdOrPassword();
        }
      })
      // No IDs found in the Firestore
      .catch(error => {this.swalWrongIdOrPassword()});
  }

  // Return a wrong ID or password alert
  private swalWrongIdOrPassword() {
    Swal.fire({
      title: "Error!",
      html: "Wrong ID or Password!",
      type: 'error'
    });
  }

  // Logout using Firebase Auth
  logOut() {
    this.afAuth.auth.signOut();
  }

  // Adding a new visitor to the Firebase (from Register component)
  registerVisitor(email: string, password: string, vFirstName: string, vLastName: string, phone: string,  rFirstName: string, rLastName: string) {
    // Verify if the input resident exists in Firestore
    this.afs.collection('residents', ref =>
      ref.where('rFirstName', '==', rFirstName).where('rLastName', '==', rLastName)).get().toPromise()
      .then(snapshot => {
        if(snapshot.docs.length != 0) {
          // Get all IDs in the Firestore
          this.afs.collection('id-list').get().toPromise().then(idSnapshot => {
            this.afs.collection('users').get().toPromise().then(userSnapshot => {
              let emails = [];
              userSnapshot.docs.forEach(doc => {
                emails.push(doc.data().email);
              })
              if(!emails.includes(email)) {
                // Get a new ID that is unique from the IDs in the Firestore
                const newID = randomUniqueID(idSnapshot);
                // Create a new Visitor object, convert it to a JS object and add it to 'visitors' collection
                const visitor = new Visitor(newID, vFirstName, vLastName, email, phone, [snapshot.docs[0].id], [], [], false, false);
                this.afs.collection('visitors').doc(newID).set(Object.assign({}, visitor));
                // Add into the 'users' and 'id-list' collections
                this.addUser(newID, email, 'visitor', vFirstName, password);
                // Return a success alert
                Swal.fire({
                  title: "Account created!",
                  html: "Your new ID has been sent to your email!",
                  type: 'success',
                  confirmButtonText: "Login now!"
                })
                .then(() => {
                  this.router.navigate(['/login', 'login-v'])
                });
              }
              else { // Return an alert if the email has already been used
                Swal.fire({
                  title: "Error!",
                  html: "Email is already in use!",
                  type: 'error'
                })
              }
            })
          })
        }
        else { // Return an alert if no residents are found
          Swal.fire({
            title: "Error!",
            html: "No residents found!",
            type: 'error'
          })
        }
      })
  }

  // Add the user to the 'users' and 'id-list' collections
  addUser(id: string, email: string, userType: string, firstName: string, password?: string) {
    // If the user is not a visitor, generate a random password
    if(password == undefined){ 
      password = randomPassword();
    }
    
    // Add into the 'users' and 'id-list' collections
    const user = new User(id, email, userType);
    this.afs.collection('users').doc(id).set(Object.assign({}, user));
    const newId = new IDList(id);
    this.afs.collection('id-list').doc(id).set(Object.assign({}, newId));

    // Add the user into Firebase Auth using the user's email and password
    // Create a POST request to the Express server
    const addData = {
      email: email,
      password: password
    }
    const addPost = this.http.post("http://aged-care.herokuapp.com/add-auth-user-fb", addData);

    // Send a new account email
    // Create a POST request to the Express server
    const emailData = this.emailService.emailNewAccount(email, id, firstName, userType, password);
    const emailPost = this.http.post("http://aged-care.herokuapp.com/send-email", emailData);

    // Joins the two requests together and call them at a same time
    forkJoin(addPost, emailPost).subscribe();
  }

  // Delete the user from all corresponding collections
  deleteUser(id: string) {
    this.afs.collection('users', ref => ref.where('id', '==', id)).get().toPromise()
      .then(snapshot => { snapshot.forEach(doc => { 
        // Delete the user from Firebase Auth
        // Make a POST request to the Express server
        const data = {
          email: doc.data().email
        }
        this.http.post("http://aged-care.herokuapp.com/delete-auth-user-fb", data).subscribe();

        // Delete from the 'users' and 'id-list' collections
        this.afs.collection('users').doc(id).delete();
        this.afs.collection('id-list').doc(id).delete();
      })});
  }
}
