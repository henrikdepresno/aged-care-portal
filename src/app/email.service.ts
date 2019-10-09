import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  // Create a new account email instance for send-email POST requests
  emailNewAccount(email: string, id: string, firstName: string, userType: string, password?: string) {
    let text = "";
    if(userType == 'visitor') { // If the new user is a visitor, do not include the input password
      text = `
      Hello ${firstName},

      You can access your new account with this ID:
      ID: ${id}

      You can log in to your account here:
      http://aged-care.herokuapp.com/login/login-${userType.charAt(0)}

      You can also reset your password here if you forget:
      http://aged-care.herokuapp.com/reset-password
      
      Welcome to ACP,
      Your ACP team
      `
    }
    else { // Must include the generated password with other user types
      text = `
      Hello ${firstName},

      You can access your new account with this ID and password:
      ID: ${id}
      Password: ${password}

      You can log in to your account here:
      http://aged-care.herokuapp.com/login/login-${userType.charAt(0)}

      You can also reset your password here:
      http://aged-care.herokuapp.com/reset-password
      
      Welcome to ACP,
      Your ACP team
      `
    }
    const data = {
      email: email,
      subject: "Welcome to Onshoring ACP!",
      text: text
    }
    return data;
  }

  // Return an appropriate alert to check if the input email exists in Firebase
  emailResetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire({
          title: "Reset Password Email Sent!",
          html: "Please check your inbox for a reset email!",
          type: 'success'
        })
        .then(() => {
          this.router.navigate(['/login'])
        })
      })
      .catch(() => {
        Swal.fire({
          title: "Error!",
          html: "Email does not exist in ACP!",
          type: 'error'
        })
      })
  }
}
