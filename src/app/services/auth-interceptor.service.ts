import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = 'bearer ' + (localStorage.getItem('token'));
    let request = req;

    if(token){
      request = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse)=>{
        if(err.status === 403 || err.status === 401) {
          this.router.navigateByUrl('/inicio');
        }
        return throwError(err);
      })
    );
    
  }

  constructor( private router: Router) { }
}
