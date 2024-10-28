// src/app/services/order.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDER_CREATE_URL, ORDER_GET_ALL_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_PAY_URL, ORDER_TRACK_URL } from '../shared/constants/urls';
import { Order } from '../shared/models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  // Create a new order
  create(order: Order): Observable<Order> {
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  // Fetch all orders for the current user
  getAllOrdersForCurrentUser(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_GET_ALL_URL);
  }

  // Get the latest new order for the current user
  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  // Process payment for an order using the Order object
  pay(order: Order): Observable<string> {
    // Assuming you want to use order.id as the orderId for payment
    return this.http.post<string>(ORDER_PAY_URL, { orderId: order.id });
  }

  // Track an order by its ID
  trackOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${ORDER_TRACK_URL}${id}`);
  }
}
