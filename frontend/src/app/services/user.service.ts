// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { AdminUserRegister } from '../shared/interfaces/AdminUserRegister';
import { User } from '../shared/models/User';
import {
  USER_LOGIN_URL,
  USER_REGISTER_URL,
  USER_GET_ALL_URL,
  USER_ADD_URL,
  USER_DELETE_URL
} from '../shared/constants/urls';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  // Login method
  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Welcome to Foodmine, ${user.name}!`, 'Login Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  // Register method
  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Welcome to Foodmine, ${user.name}`, 'Register Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed');
        }
      })
    );
  }

  // Logout method to clear local storage and BehaviorSubject
  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  // Fetch all users (for Admin)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(USER_GET_ALL_URL);
  }

  // Add a new user (for Admin)
  addUser(userRegister: AdminUserRegister): Observable<User> {
    return this.http.post<User>(USER_ADD_URL, userRegister).pipe(
      tap({
        next: (newUser) => {
          this.toastrService.success(`User ${newUser.name} added successfully!`, 'User Added');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Add User Failed');
        }
      })
    );
  }

  // Delete a user by ID (for Admin)
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${USER_DELETE_URL}/${userId}`).pipe(
      tap({
        next: () => {
          this.toastrService.success('User deleted successfully', 'Delete Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Delete Failed');
        }
      })
    );
  }

  // Helper methods for local storage management
  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) as User : new User();
  }
}
