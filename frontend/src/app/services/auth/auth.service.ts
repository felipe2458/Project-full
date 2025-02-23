import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPlayoad } from '../../model/model';
import { ApiService } from '../api/api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) { }

  async isLoggedIn(token: string): Promise<boolean>{
    if(!token) return false;

    try{
      const decoded: JwtPlayoad = jwtDecode<JwtPlayoad>(token);
      const users = await firstValueFrom(this.apiService.getUsers());
      const userExists = users.some(user => user.username === decoded.username);

      if(!userExists) return false;

      return decoded.exp !== undefined && decoded.exp * 1000 > Date.now();
    }catch(e){
      return false;
    }
  }

  getUsername(): string | null{
    const token = localStorage.getItem('token');
    if(!token) return null;

    try{
      const decoded: any = jwtDecode(token)
      return decoded.username || null;
    }catch(e){
      return null;
    }
  }
}
