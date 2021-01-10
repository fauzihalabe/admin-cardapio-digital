import { AuthService} from './verificador';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private authService: AuthService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.logado().then((user) => {
      console.log(user)
      if (user) {
        return true
      }
      else {
        this._router.navigate(['/auth/login']);
        return false
      }
    })

  
    // navigate to login page
    // this._router.navigate(['/auth/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    // return re;
  }

}