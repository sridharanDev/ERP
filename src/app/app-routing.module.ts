import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './utils/auth-guard.service';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StaffRoleComponent } from './pages/staff-role/staff-role.component';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { AddStaffComponent } from './pages/add-staff/add-staff.component';
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




const routes: Routes = [
  {
    path: 'admin',component:AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuardService],data: { module: ['dashboard']}},
      { path: 'staff-role', component: StaffRoleComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'upcomming-projects', component: UpcommingProjectsComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'ongoing-projects', component: OngoingProjectsComponent ,canActivate: [AuthGuardService],data: { module: ['project']}},
      { path: 'completed-projects', component: CompletedProjectsComponent ,canActivate: [AuthGuardService],data: { module: ['project']}},
      { path: 'courses', component: CoursesComponent ,canActivate: [AuthGuardService],data: { module: ['course']}},
      { path: 'students', component: StudentsComponent ,canActivate: [AuthGuardService],data: { module: ['course']}},
      { path: 'billing', component: BillingComponent ,canActivate: [AuthGuardService],data: { module: ['course','project']}},
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'staff-list',
        children: [
          { path: '', component: StaffListComponent },
          { path: 'add-staff', component: AddStaffComponent },
          { path: 'edit-staff/:id', component: EditStaffComponent },
        ]
        ,canActivate: [AuthGuardService],data: { module: ['staff']}
      },
      // Make enquiry a child route
      {
        path: 'enquiry',
        children: [
          { path: '', component: EnquiryComponent },
          { path: 'add-student', component: AddStudentComponent },
          { path: 'edit-student/:id', component: EditStudentComponent },
        ]
        ,canActivate: [AuthGuardService],data: { module: ['course']}
      },
      { path: 'salary', component: SalaryComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'admin-users', component: AdminUsersComponent ,canActivate: [AuthGuardService],data: { module: ['admin']}},
      { path: 'admin-role', children:[
        { path: '', component: AdminRoleComponent },
        { path: 'add', component: AddAdminRoleComponent },
        { path: 'edit/:id', component: EditAdminRoleComponent },
      ],canActivate: [AuthGuardService],data: { module: ['admin']}},
    ],
  },
  { path: 'admin/login', component: LoginComponent },
  // Standalone route for the invoice
  { path: 'invoice/:invoice_no', component: InvoiceComponent ,canActivate: [AuthGuardService],data: { module: ['course','project']}},
  {path:'',component:StaffLoginComponent},
  {path:'**',component:ErrorPageComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }