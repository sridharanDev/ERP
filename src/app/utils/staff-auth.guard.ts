import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StaffService } from '../services/staff.service';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthGuard implements CanActivate {

  constructor(private staffService:StaffService,private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if (this.staffService.isAuthenticated()) {
      return true; 
    } else {
      return this.router.createUrlTree(['/']);
    }
  }
}
