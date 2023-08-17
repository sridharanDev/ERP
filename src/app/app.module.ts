import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgChartsModule } from 'ng2-charts';

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
import { AddProjectComponent } from './pages/add-project/add-project.component';
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
import { StaffSidebarComponent } from './components/staff-sidebar/staff-sidebar.component';
import { StaffTasksComponent } from './pages/staff-pages/staff-tasks/staff-tasks.component';
import { ManageTasksComponent } from './pages/manage-tasks/manage-tasks.component';
import { StaffNavbarComponent } from './components/staff-navbar/staff-navbar.component';
import { ViewProjectComponent } from './pages/view-project/view-project.component';
import { AttendanceComponent } from './pages/staff-pages/attendance/attendance.component';
import { AttendanceCalendarComponent } from './components/attendance-calendar/attendance-calendar.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { IncomeComponent } from './pages/income/income.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { ExpenseTypeComponent } from './pages/expense-type/expense-type.component';
import { AssetsTypeComponent } from './pages/assets-type/assets-type.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { StaffLeaveComponent } from './pages/staff-pages/staff-leave/staff-leave.component';
import { LeaveApplicationComponent } from './pages/leave-application/leave-application.component';
import { StaffWorklogComponent } from './pages/staff-pages/staff-worklog/staff-worklog.component';
import { WorklogComponent } from './pages/worklog/worklog.component';
import { SidebarDirective } from './components/sidebar/sidebar.directive';
import { StaffReportComponent } from './pages/staff-report/staff-report.component';
import { ProjectStaffAssignComponent } from './pages/project-staff-assign/project-staff-assign.component';
import { ProjectReportComponent } from './pages/project-report/project-report.component';
import { CourseReportComponent } from './pages/course-report/course-report.component';
import { IncomeReportComponent } from './pages/income-report/income-report.component';

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
    AddProjectComponent,
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
    StudentProfileComponent,
    InvoicesComponent,
    StaffAttendanceComponent,
    StaffRootComponent,
    StaffDashboardComponent,
    StaffSidebarComponent,
    StaffTasksComponent,
    ManageTasksComponent,
    StaffNavbarComponent,
    ViewProjectComponent,
    AttendanceComponent,
    AttendanceCalendarComponent,
    EditProjectComponent,
    IncomeComponent,
    AssetsComponent,
    ExpenseComponent,
    ExpenseTypeComponent,
    AssetsTypeComponent,
    ScheduleComponent,
    StaffLeaveComponent,
    LeaveApplicationComponent,
    StaffWorklogComponent,
    WorklogComponent,
    SidebarDirective,
    StaffReportComponent,
    ProjectStaffAssignComponent,
    ProjectReportComponent,
    CourseReportComponent,
    IncomeReportComponent,
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
