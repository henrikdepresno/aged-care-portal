import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import swal from 'sweetalert';

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
      
      <p>Welcome to ACP,</p>
      <p>Your ACP team</p>
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
      
      <p>Welcome to ACP,</p>
      <p>Your ACP team</p>
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
        swal({
          title: "Reset Password Email Sent!",
          text: "Please check your inbox for a reset email!",
          icon: "success",
          buttons: {
            ok: "Login"
          }
        } as any)
        .then(() => {this.router.navigate(['/login'])});
      })
      .catch(() => {
        swal({
          title: "Error!",
          text: "Email does not exist in ACP!",
          icon: "error",
          buttons: {
            ok: "OK"
          }
        } as any)
      })
  }
}
