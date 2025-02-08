import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-register-user',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  constructor(private router: Router, private api: ApiService) { }

  username: string = '';
  password: string = '';
  confirmPass: string = '';

  color_username: string = '#8f8f8f';
  color_password: string = '#8f8f8f';
  color_confirmPass: string = '#8f8f8f';

  erro_username: boolean = false;
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
    if (identify.trim().length <= min || identify.length >= max) {
      if (identify.trim().length !== 0) {
        this[`erro_${field}`] = true;
        this[`erro_submit_${field}`] = false;
        this[`color_${field}`] = '#a10000';
      } else {
        this[`erro_${field}`] = false;
        this[`color_${field}`] = '#8f8f8f';
      }
    } else {
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
      e.preventDefault();
      this.erro_submit_password = true;
    }

    if(this.confirmPass.trim().length < 8 || this.confirmPass.trim().length > 50){
      e.preventDefault();
      this.erro_submit_confirmPass = true;
    }

    if(!this.erro_submit_username && !this.erro_submit_password && !this.erro_submit_confirmPass){
      this.api.setUser({ name: this.username, password: this.password });

      this.router.navigate(['/login']);
    }
  }

}
