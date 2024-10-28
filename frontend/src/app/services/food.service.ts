import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL, FOOD_BY_ID_URL, FOODS_ADD_URL, FOODS_DELETE_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  // Get all foods
  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  // Search for foods by a search term
  getAllFoodsBySearchTerm(searchTerm: string): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  // Get all tags
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  // Filter foods by a specific tag
  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag === "All" ? this.getAll() : this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  // Get a food item by its ID
  getFoodById(foodId: string): Observable<Food> {
    return this.http.get<Food>(FOOD_BY_ID_URL + foodId);
  }

  // Add a new food item
  addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(FOODS_ADD_URL, food);
  }

  // Delete a food item by its ID
  deleteFood(foodId: string): Observable<void> {
    return this.http.delete<void>(`${FOODS_DELETE_URL}/${foodId}`);
  }
}
