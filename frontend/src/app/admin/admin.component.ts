import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FoodService } from '../services/food.service';
import { User } from '../shared/models/User';
import { Food } from '../shared/models/Food';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];  
  foods: Food[] = [];
  user = { name: '', email: '', password: '', address: '' }; 
  food: Food = {
    id: '',
    name: '',
    price: 0,
    tags: [],
    favorite: false,
    stars: 0,
    imageUrl: '',
    origins: [],
    cookTime: ''
  };

  constructor(private userService: UserService, private foodService: FoodService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadFoods();
  }

  // Load all users from the database
  loadUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  // Load all foods from the database
  loadFoods(): void {
    this.foodService.getAll().subscribe(foods => this.foods = foods);
  }

  // Add a new user
  addUser(): void {
    this.userService.addUser(this.user).subscribe(newUser => {
      this.users.push(newUser);
      this.user = { name: '', email: '', password: '', address: '' }; 
    });
  }

  // Delete a user by ID
  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
    });
  }

  // Add a new food item
  addFood(): void {
    this.foodService.addFood(this.food).subscribe(newFood => {
      this.foods.push(newFood);
      this.food = {
        id: '',
        name: '',
        price: 0,
        tags: [],
        favorite: false,
        stars: 0,
        imageUrl: '',
        origins: [],
        cookTime: ''
      }; // Reset food form
    });
  }

  // Delete a food item by ID
  deleteFood(foodId: string): void {
    this.foodService.deleteFood(foodId).subscribe(() => {
      this.foods = this.foods.filter(food => food.id !== foodId);
    });
  }
}
