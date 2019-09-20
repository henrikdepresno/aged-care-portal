import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import bootstrap from 'bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';

import { NotFoundComponent } from './not-found/not-found.component';

import { LoginComponent } from './login/login.component';
import { A_LoginComponent } from './login/a-login/a-login.component';
import { C_LoginComponent } from './login/c-login/c-login.component';
import { S_LoginComponent } from './login/s-login/s-login.component';
import { V_LoginComponent } from './login/v-login/v-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { A_C_AddComponent } from './admin/a-contractor/a-c-add/a-c-add.component';
import { A_C_UpdateComponent } from './admin/a-contractor/a-c-update/a-c-update.component';
import { A_C_ViewComponent } from './admin/a-contractor/a-c-view/a-c-view.component';
import { A_FeedbackComponent } from './admin/a-feedback/a-feedback.component';
import { A_R_AddComponent } from './admin/a-resident/a-r-add/a-r-add.component';
import { A_R_UpdateComponent } from './admin/a-resident/a-r-update/a-r-update.component';
import { A_R_ViewComponent } from './admin/a-resident/a-r-view/a-r-view.component';
import { A_S_AddComponent } from './admin/a-staff/a-s-add/a-s-add.component';
import { A_S_UpdateComponent } from './admin/a-staff/a-s-update/a-s-update.component';
import { A_S_ViewComponent } from './admin/a-staff/a-s-view/a-s-view.component';
import { A_V_UpdateComponent } from './admin/a-visitor/a-v-update/a-v-update.component';
import { A_V_ViewComponent } from './admin/a-visitor/a-v-view/a-v-view.component';

import { C_UpdateComponent } from './contractor/c-update/c-update.component';

import { S_FeedbackComponent } from './staff/s-feedback/s-feedback.component';
import { S_R_ScheduleComponent } from './staff/s-resident/s-r-schedule/s-r-schedule.component';
import { S_R_ViewComponent } from './staff/s-resident/s-r-view/s-r-view.component';
import { S_V_ViewComponent } from './staff/s-visitor/s-v-view/s-v-view.component';

import { V_B_AddComponent } from './visitor/v-booking/v-b-add/v-b-add.component';
import { V_B_ModifyComponent } from './visitor/v-booking/v-b-modify/v-b-modify.component';
import { V_B_ViewComponent } from './visitor/v-booking/v-b-view/v-b-view.component';
import { V_R_AddComponent } from './visitor/v-resident/v-r-add/v-r-add.component';
import { V_R_ViewComponent } from './visitor/v-resident/v-r-view/v-r-view.component';
import { V_RegisterComponent } from './visitor/v-register/v-register.component';
import { V_UpdateComponent } from './visitor/v-update/v-update.component';

import { AuthService } from './auth.service';
import { VisitorService } from './visitor/visitor.service';
import { ContractorService } from './contractor/contractor.service';
import { StaffService } from './staff/staff.service';
import { AdminService } from './admin/admin.service';

@NgModule({
  declarations: [
    AppComponent,
    
    NotFoundComponent,

    LoginComponent,
    A_LoginComponent,
    C_LoginComponent,
    S_LoginComponent,
    V_LoginComponent,
    ResetPasswordComponent,

    A_C_AddComponent,
    A_C_UpdateComponent,
    A_C_ViewComponent,
    A_FeedbackComponent,
    A_R_AddComponent,
    A_R_UpdateComponent,
    A_R_ViewComponent,
    A_S_AddComponent,
    A_S_UpdateComponent,
    A_S_ViewComponent,
    A_V_UpdateComponent,
    A_V_ViewComponent,

    C_UpdateComponent,

    S_FeedbackComponent,
    S_R_ScheduleComponent,
    S_R_ViewComponent,
    S_V_ViewComponent,

    V_B_AddComponent,
    V_B_ModifyComponent,
    V_B_ViewComponent,
    V_R_AddComponent,
    V_R_ViewComponent,
    V_RegisterComponent,
    V_UpdateComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'aged-care-portal'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    VisitorService,
    ContractorService,
    StaffService,
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
