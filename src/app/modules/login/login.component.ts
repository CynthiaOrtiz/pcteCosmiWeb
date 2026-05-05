import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUsuario } from '../../model/login-usuario';
import { AuthService } from '../../core/auth.service';
import { TokenService } from '../../core/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  loginUsuario!: LoginUsuario;
  nombreUsuario = '';
  password = '';
  errMsj = '';
  hidePassword = true;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.router.navigate(['/hom']);
    }
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario();
    this.loginUsuario.nombreUsuario = this.nombreUsuario;
    this.loginUsuario.password = this.password;
    
    this.authService.login(this.loginUsuario).subscribe({
      next: (data) => {
        this.isLogged = true;
        this.isLoginFail = false;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.router.navigate(['/hom']);
      },
      error: (err) => {
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error?.message || 'Usuario o contraseña incorrectos';
        this.snackBar.open(this.errMsj, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
