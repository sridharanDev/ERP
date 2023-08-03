import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService: AdminService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the user is authenticated
    if (this.authService.isAuthenticated()) {
      // Check if the user has the required role to access the route
      const requiredRoles = route.data['module'] as string[];
      if (this.authService.hasModules(requiredRoles)) {
        return true;
      }
    }

    // Redirect the user to the login page or unauthorized page
    this.router.navigate(['/admin/login']);
    return false;
  }
}
