import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api/api.service';
import { toArray } from 'rxjs';

@Component({
  selector: 'app-register-user',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  constructor(private router: Router, private api: ApiService) {
    this.api.getUsers().subscribe(response => {
      response.forEach(user => {
        this.usersExist.push(user.username);
      });
    })
  }

  usersExist: string[] = [];

  username: string = '';
  password: string = '';
  confirmPass: string = '';

  color_username: string = '#8f8f8f';
  color_password: string = '#8f8f8f';
  color_confirmPass: string = '#8f8f8f';

  erro_username: boolean = false;
  erro_userExists: boolean = false;
  erro_password: boolean = false;
  erro_confirmPass: boolean = false;

  topLabel_username: string = '0px';
  topLabel_password: string = '0px';
  topLabel_confirmPass: string = '0px';

  type_password: boolean = false;
  type_confirmPass: boolean = false;

  erro_submit_username: boolean = false;
  erro_submit_password: boolean = false;
  erro_submit_confirmPass: boolean = false;

  Input(min: number, max: number, identify: string, field: 'username' | 'password' | 'confirmPass') {
    if(identify.trim().length <= min || identify.length >= max){
      if(identify.trim().length !== 0){
        this[`erro_${field}`] = true;
        this[`erro_submit_${field}`] = false;
        this[`color_${field}`] = '#a10000';
      }else{
        if(field === 'username'){
          if(this.erro_userExists) this.erro_userExists = false;
        }

        this[`erro_${field}`] = false;
        this[`color_${field}`] = '#8f8f8f';
      }
    }else{
      if(field === 'username'){
        this.erro_userExists = this.usersExist.includes(identify.trim());

        if(this.erro_userExists){
          this.color_username = '#a10000';
          return;
        }
      }
      this[`erro_${field}`] = false;
      this[`color_${field}`] = '#00e000';
    }
  }

  focusInput(toplabel: 'username' | 'password' | 'confirmPass') {
    this[`topLabel_${toplabel}`] = '-70px';
  }

  blurInput(toplabel: 'username' | 'password' | 'confirmPass', identify: string) {
    if(identify.trim().length === 0) {
      this[`topLabel_${toplabel}`] = '0px';
    }
  }

  viewPass(input: 'password' | 'confirmPass') {
    this[`type_${input}`] = !this[`type_${input}`];
  }

  ConfirmPass(label: | 'password' | 'confirmPass') {
    if(this.password !== this.confirmPass){
      this[`color_${label}`] = '#a10000';
      this.erro_confirmPass = true;
    }else{
      this[`color_${label}`] = '#00e000';
      this.erro_confirmPass = false;
    }
  }

  passInput(min: number, max: number, identify: string, field: 'password' | 'confirmPass') {
    this.Input(min, max, identify, field);
    this.ConfirmPass('password')
    this.ConfirmPass('confirmPass');
  }

  enviForm(e: Event) {
    if(this.username.trim().length <= 10 || this.username.trim().length >= 100){
      this.erro_submit_username = true;
      e.preventDefault();
    }

    if(this.password.trim().length < 8 || this.password.trim().length > 50){
      this.erro_submit_password = true;
      e.preventDefault();
    }

    if(this.confirmPass.trim().length < 8 || this.confirmPass.trim().length > 50){
      this.erro_submit_confirmPass = true;
      e.preventDefault();
    }

    if(!this.erro_submit_username && !this.erro_submit_password && !this.erro_submit_confirmPass && !this.erro_username && !this.erro_password && !this.erro_confirmPass){
      this.api.register({ username: this.username.trim(), password: this.password.trim() }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: error => {
          if(error.status === 400){
            this.erro_userExists = true;
            this.color_username = '#a10000';
          }
        }
      });
    }
  }
}
