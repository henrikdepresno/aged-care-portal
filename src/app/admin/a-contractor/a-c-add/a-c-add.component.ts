import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import $ from 'jquery';
import { AdminService } from '../../admin.service';
import { capitalize } from 'src/app/functions';

@Component({
  selector: 'app-a-c-add',
  templateUrl: './a-c-add.component.html',
  styleUrls: ['./a-c-add.component.scss']
})
export class A_C_AddComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.router.navigate(['/admin', 'contractor-add']);

    $('#inputFirstName, #inputLastName, #inputPhone, #inputEmail, #inputCompanyName, #inputField').keyup(e => {
      if(e.which == 13) {
        this.addContractor();
      }
    });
  }

  addContractor() {
    const cFirstName = capitalize($('#inputFirstName').val());
    const cLastName = capitalize($('#inputLastName').val());
    const email = $('#inputEmail').val();
    const phone = $('#inputPhone').val();
    const companyName = $('#inputCompanyName').val();
    const field = capitalize($('#inputField').val());
    if(cFirstName != "" && cLastName != "" && email != "" && phone != "" && companyName != "" && field != ""){
      if(phone.match(/^\d+$/)){
        this.adminService.addContractor(cFirstName, cLastName, email, phone, companyName, field);
      }
    }
    else {
      console.log("SOME FIELDS ARE EMPTY")
    }
  }

}
