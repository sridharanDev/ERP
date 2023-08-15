import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';
import { TaskService } from 'src/app/services/task.service';
import { TaskCommentCommentService } from 'src/app/services/task-comment.service';
import { WorklogService } from 'src/app/services/worklog.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  leaveApplicationCount: number = 0;
  taskCount: number = 0;
  worklogCount: number = 0;

  constructor(
    private adminService: AdminService,
    private leaveApplicationService: LeaveApplicationService,
    private taskService: TaskService,
    private worklogService: WorklogService,
    private taskCommentService:TaskCommentCommentService
  ) {}

  ngOnInit(): void {
    this.updateCounts(); // Initial count update

    // Fetch counts every 10 seconds (adjust the interval as needed)
    interval(10000).subscribe(() => {
      this.updateCounts();
    });
  }

  updateCounts() {
    this.getAllLeaveApplications();
    this.getAllTasks();
    this.getAllWorkLogs();
  }

  getAllLeaveApplications() {
    this.leaveApplicationService.GetApplications('').subscribe((res: any) => {
      let leaveApplicationCount = 0;
      for (const application of res) {
        if (application.status === 'pending') {
          leaveApplicationCount++;
        }
      }
      this.leaveApplicationCount = leaveApplicationCount;
    });
  }

  getAllTasks() {
    let taskCount = 0;
    this.taskService.GetTasks('').subscribe((res: any) => {
      for(const task of res)
      {
        const query = "task="+task._id;
        // this.taskCommentService.GetTaskComments(query).subscribe((res:any)=>{

        // });
        taskCount++;
      }
      this.taskCount = taskCount;
    });
  }

  getAllWorkLogs() {
    this.worklogService.GetWorklogs('').subscribe((res: any) => {
      this.worklogCount = res.length;
    });
  }

  hasModules(modules: string[]) {
    return this.adminService.hasModules(modules);
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }
}
