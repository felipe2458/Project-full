import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from '../../services/auth/auth.service';
import { authGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private api: ApiService, private router: Router, private auth: AuthService) { }

  username: string = '';
  password: string = '';

  erro_username_empty: boolean = false;
  erro_password_empty: boolean = false;

  erro_user_notfound: boolean = false;
  erro_password_incorrect: boolean = false;

  topLabel_username: string = '30%';
  topLabel_password: string = '30%';

  Input(input: 'username' | 'password') {
    if(this[`${input}`].trim().length !== 0){
      this[`erro_${input}_empty`] = false;
    }else if(input === 'username'){
      this.erro_user_notfound = false;
    }else if(input === 'password'){
      this.erro_password_incorrect = false;
    }
  }

  focusInput(input: 'username' | 'password') {
    this[`topLabel_${input}`] = '-5%';
  }

  blurInput(input: 'username' | 'password'){
    if(this[`${input}`].trim().length !== 0){
      this[`topLabel_${input}`] = '-5%';
    }else{
      this[`topLabel_${input}`] = '30%';
    }
  }

  enviForm(e: Event){
    if(this.username.trim().length === 0){
      this.erro_username_empty = true;
    }

    if(this.password.trim().length === 0){
      this.erro_password_empty = true;
    }

    if(this.erro_password_empty || this.erro_username_empty){
      e.preventDefault();
    }else{
      this.api.login({ username: this.username, password: this.password }).subscribe({
        next: (response) => {
          localStorage.setItem('token', `${response}`);

          const username = this.auth.getUsername();

          if(username){
            this.router.config.push({
              path: `user/${username}`,
              loadChildren: () => import('../../modules/user-routes/user-routes-routing.module').then(m => m.UserRoutesRoutingModule ),
                canActivate: [authGuard]
              });
          }

          this.router.navigate([`user/${this.auth.getUsername()}`]);
        },
        error: error => {
          if(error.status === 404){
            this.erro_user_notfound = true;
          }

          if(error.status === 400){
            this.erro_password_incorrect = true;
          }
        }
      })
    }
  }
}
