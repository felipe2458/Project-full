import { Component } from '@angular/core'
import { AuthService } from './services/auth/auth.service';
import { RouterOutlet, Router } from '@angular/router';
import { authGuard } from './guards/auth.guard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  constructor(private authService: AuthService, private router: Router){
    const username = this.authService.getUsername();

    if(username){
      this.router.config.push({
         path: `user/${username}`,
         loadChildren: () => import('./modules/user-routes/user-routes-routing.module').then(m => m.UserRoutesRoutingModule ),
          canActivate: [authGuard]
        });
    }
  }
}
