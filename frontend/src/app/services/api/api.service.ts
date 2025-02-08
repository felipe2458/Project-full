import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  apiUrl = 'http://localhost:3090';

  setUser(dados: { name: string, password: string }){
    return this.http.post(`${this.apiUrl}/register`, dados).subscribe(response =>{
      console.log(response);
    });
  }
}
