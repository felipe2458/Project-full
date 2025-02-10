import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPlayoad } from '../../model/model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isTokenValid(token: string): boolean{
    if(!token) return false;

    try{
      const decoded: JwtPlayoad = jwtDecode<JwtPlayoad>(token);
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
