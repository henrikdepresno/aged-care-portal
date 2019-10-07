import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';
import { AdminService } from '../../admin.service';
import { capitalize, isNumeric } from 'src/app/functions';

@Component({
  selector: 'app-a-r-add',
  templateUrl: './a-r-add.component.html',
  styleUrls: ['./a-r-add.component.scss']
})
export class A_R_AddComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'resident-add']);

    this.validateUserType();

    $('#inputFirstName, #inputLastName, #inputPhone').keyup(e => {
      if(e.which == 13) {
        this.addResident();
      }
    });
  }

  validateUserType() {
    return new Promise(() => {
      this.authService.checkUserType();
    })
  }

  addResident(){
    const rFirstName = capitalize($('#inputFirstName').val());
    const rLastName = capitalize($('#inputLastName').val());
    const phone = $('#inputPhone').val();
    if(rFirstName != "" && rLastName != "" && phone != "") {
      if(isNumeric(phone)) {
        Swal.fire({
          title: "Success!",
          html: "Resident added",
          type: 'success'
        })
        .then(() => {
          this.adminService.addResident(rFirstName, rLastName, phone);
        });
      }
      else {
        this.swalError("The phone number can only be digits!")
      }
    }
    else {
      this.swalError("Some fields are left empty!")
    }
  }

  private swalError(errorText: string) {
    Swal.fire({
      title: "Error!",
      html: errorText,
      type: 'error'
    })
  }

}
