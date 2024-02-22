
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:4000/api/login', { username: this.username, password: this.password })
      .subscribe((response) => {
        if (response.success) {
          if (response.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.role === 'employee') {
            this.router.navigate(['/employee']);
          }
        } else {
          alert('Invalid username or password');
        }
      });
  }
}
