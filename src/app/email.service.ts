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

  emailNewAccount(email: string, id: string, firstName: string, userType: string, password?: string) {
    let text = "";
    if(userType == 'visitor') {
      text = `
      Hello ${firstName},

      You can access your new account with this ID:
      ID: ${id}

      You can log in to your account here:
      http://localhost:4200/login/login-${userType.charAt(0)}

      You can also reset your password here if you forget:
      http://localhost:4200/reset-password
      
      Welcome to ACP,
      Your ACP team
      `
    }
    else {
      text = `
      Hello ${firstName},

      You can access your new account with this ID and password:
      ID: ${id}
      Password: ${password}

      You can log in to your account here:
      http://localhost:4200/login/login-${userType.charAt(0)}

      You can also reset your password here:
      http://localhost:4200/reset-password
      
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

  emailResetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire({
          title: "Reset Password Email Sent!",
          text: "Please check your inbox for a reset email!",
          type: 'success'
        })
        .then(() => {
          this.router.navigate(['/login'])
        })
      })
      .catch(() => {
        Swal.fire({
          title: "Error!",
          text: "Email does not exist in ACP!",
          type: 'error'
        })
      })
  }
}
