import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartQuantity = 0;
  user!: User;

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {
    // Subscribe to cart changes to update cart quantity
    this.cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    });

    // Subscribe to user changes to update user info and admin status
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit(): void {}

  // Log the user out and clear stored information
  logout() {
    this.userService.logout();
  }

  // Check if the user is authenticated by verifying if a token exists
  get isAuth(): boolean {
    return !!(this.user && this.user.token);
  }

  // Check if the user has admin privileges
  get isAdmin(): boolean {
    return !!(this.user && this.user.isAdmin); // Assuming `isAdmin` is a boolean in `User`
  }
}
