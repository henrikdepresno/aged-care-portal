import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth
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
    this.http.post("http://localhost:3000/send-mail", data).subscribe();
  }

  emailResetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
