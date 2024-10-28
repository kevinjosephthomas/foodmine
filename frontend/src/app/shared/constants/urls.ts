// src/app/shared/constants/urls.ts
import { environment } from "src/environments/environment";

const BASE_URL = environment.production ? '' : 'http://localhost:5000';

// Food URLs
export const FOODS_URL = `${BASE_URL}/api/foods`;
export const FOODS_TAGS_URL = `${FOODS_URL}/tags`;
export const FOODS_BY_SEARCH_URL = `${FOODS_URL}/search/`;
export const FOODS_BY_TAG_URL = `${FOODS_URL}/tag/`;
export const FOOD_BY_ID_URL = `${FOODS_URL}/`;
export const FOODS_ADD_URL = `${FOODS_URL}/add`; // URL for adding a new food item
export const FOODS_DELETE_URL = `${FOODS_URL}/delete`; // URL for deleting a food by ID

// User URLs
export const USER_LOGIN_URL = `${BASE_URL}/api/users/login`;
export const USER_REGISTER_URL = `${BASE_URL}/api/users/register`;
export const USER_GET_ALL_URL = `${BASE_URL}/api/users`;
export const USER_ADD_URL = `${USER_GET_ALL_URL}/add`; // URL for adding a new user
export const USER_DELETE_URL = `${USER_GET_ALL_URL}/delete`; // URL for deleting a user by ID

// Order URLs
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const ORDER_CREATE_URL = `${ORDERS_URL}/create`; // URL for creating a new order
export const ORDER_GET_ALL_URL = `${ORDERS_URL}/all`; // URL for fetching all orders for the user
export const ORDER_NEW_FOR_CURRENT_USER_URL = `${ORDERS_URL}/newOrderForCurrentUser`; // URL for the latest order of the current user
export const ORDER_PAY_URL = `${ORDERS_URL}/pay`; // URL for order payment
export const ORDER_TRACK_URL = `${ORDERS_URL}/track/`; // URL for tracking an order by ID
