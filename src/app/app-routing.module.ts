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
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { StaffAttendanceComponent } from './pages/staff-attendance/staff-attendance.component';
import { StaffRootComponent } from './pages/staff-pages/staff-root/staff-root.component';
import { StaffDashboardComponent } from './pages/staff-pages/staff-dashboard/staff-dashboard.component';
import { StaffTasksComponent } from './pages/staff-pages/staff-tasks/staff-tasks.component';
import { ManageTasksComponent } from './pages/manage-tasks/manage-tasks.component';
import { StaffAuthGuard } from './utils/staff-auth.guard';
import { ViewProjectComponent } from './pages/view-project/view-project.component';
import { AttendanceComponent } from './pages/staff-pages/attendance/attendance.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { IncomeComponent } from './pages/income/income.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { ExpenseTypeComponent } from './pages/expense-type/expense-type.component';
import { AssetsTypeComponent } from './pages/assets-type/assets-type.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';




const routes: Routes = [
  {
    path: 'admin',component:AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuardService],data: { module: ['dashboard']}},
      { path: 'staff-role', component: StaffRoleComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'schedule', component: ScheduleComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'add-project', component: AddProjectComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'edit-project/:id', component: EditProjectComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'upcomming-projects', component: UpcommingProjectsComponent ,canActivate: [AuthGuardService],data: { module: ['staff']}},
      { path: 'ongoing-projects', component: OngoingProjectsComponent ,canActivate: [AuthGuardService],data: { module: ['project']}},
      { path: 'completed-projects', component: CompletedProjectsComponent ,canActivate: [AuthGuardService],data: { module: ['project']}},
      { path: 'project/:id', component: ViewProjectComponent ,canActivate: [AuthGuardService],data: { module: ['project']}},
      { path: 'courses', component: CoursesComponent ,canActivate: [AuthGuardService],data: { module: ['course']}},
      { path: 'students', component: StudentsComponent ,canActivate: [AuthGuardService],data: { module: ['course']}},
      { path: 'students/profile/:id', component: StudentProfileComponent ,canActivate: [AuthGuardService],data: { module: ['course']}},
      { path: 'billing', component: BillingComponent ,canActivate: [AuthGuardService],data: { module: ['course','project']}},
      { path: 'invoices/:type', component: InvoicesComponent ,canActivate: [AuthGuardService],data: { module: ['course']}},
      { path: 'manage-tasks', component: ManageTasksComponent ,canActivate: [AuthGuardService],data: { module: ['project']}},
      { path: 'incomes', component: IncomeComponent ,canActivate: [AuthGuardService],data: { module: ['others']}},
      { path: 'assets-type', component: AssetsTypeComponent ,canActivate: [AuthGuardService],data: { module: ['assets']}},
      { path: 'assets', component: AssetsComponent ,canActivate: [AuthGuardService],data: { module: ['assets']}},
      { path: 'expense-type', component: ExpenseTypeComponent ,canActivate: [AuthGuardService],data: { module: ['expenses']}},
      { path: 'expense', component: ExpenseComponent ,canActivate: [AuthGuardService],data: { module: ['expenses']}},
      
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
      { path: 'attendance', component:StaffAttendanceComponent,canActivate: [AuthGuardService],data: { module: ['staff']} },
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
  {path:'profile',component:StaffRootComponent,children:[
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path:'dashboard',component:StaffDashboardComponent},
    {path:'tasks',component:StaffTasksComponent},
    {path:'attendance',component:AttendanceComponent},
  ],canActivate: [StaffAuthGuard]},
  {path:'**',component:ErrorPageComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
