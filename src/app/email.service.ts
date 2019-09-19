import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient
  ) { }

  test() {
    const id = "123XD"
    const password = "howdoesthisevenworklmao"
    let data = {
      email: "henrikdepre@gmail.com, 123havietbach@gmail.com",
      subject: "XD",
      text: `
      Info here:
      ID: ${id}
      Password: ${password}
      `
    }
    this.http.post("http://localhost:3000/send-mail", data).subscribe();
  }
}
