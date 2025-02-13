import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:3090';

  register(user: { username: string, password: string }){
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: { username: string, password: string }){
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  getDados(url: string){
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('token') });

    return this.http.get(`${this.apiUrl}/${url}`, { headers });
  }
}
