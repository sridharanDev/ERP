import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { StaffRoleComponent } from './pages/staff-role/staff-role.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AddStaffComponent } from './pages/add-staff/add-staff.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { EditStaffComponent } from './pages/edit-staff/edit-staff.component';
import { UpcommingProjectsComponent } from './pages/upcomming-projects/upcomming-projects.component';
import { OngoingProjectsComponent } from './pages/ongoing-projects/ongoing-projects.component';
import { CompletedProjectsComponent } from './pages/completed-projects/completed-projects.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { EnquiryComponent } from './pages/enquiry/enquiry.component';
import { StudentsComponent } from './pages/students/students.component';
import { AddStudentComponent } from './pages/add-student/add-student.component';
import { EditStudentComponent } from './pages/edit-student/edit-student.component';
import { BillingComponent } from './pages/billing/billing.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminRoleComponent } from './pages/admin-role/admin-role.component';
import { AddAdminRoleComponent } from './pages/add-admin-role/add-admin-role.component';
import { EditAdminRoleComponent } from './pages/edit-admin-role/edit-admin-role.component';
import { LoginComponent } from './pages/login/login.component';
import { StaffLoginComponent } from './pages/staff-login/staff-login.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    StaffListComponent,
    StaffRoleComponent,
    LoadingComponent,
    AddStaffComponent,
    BreadcrumbComponent,
    EditStaffComponent,
    UpcommingProjectsComponent,
    OngoingProjectsComponent,
    CompletedProjectsComponent,
    CoursesComponent,
    EnquiryComponent,
    StudentsComponent,
    AddStudentComponent,
    EditStudentComponent,
    BillingComponent,
    InvoiceComponent,
    AdminComponent,
    SalaryComponent,
    AdminUsersComponent,
    AdminRoleComponent,
    AddAdminRoleComponent,
    EditAdminRoleComponent,
    LoginComponent,
    StaffLoginComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    DataTablesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }