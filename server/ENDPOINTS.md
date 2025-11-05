# API Endpoints Documentation

Base URL: `http://localhost:3001/api`

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email",
  "tempData": {
    "email": "user@example.com",
    "hashedPassword": "$2a$10$...",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 2. Verify OTP (Signup)
**POST** `/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "tempData": {
    "email": "user@example.com",
    "hashedPassword": "$2a$10$...",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

---

### 3. Resend OTP
**POST** `/auth/resend-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP resent successfully"
}
```

---

### 4. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["CUSTOMER"],
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

---

### 5. Request Password Reset
**POST** `/auth/request-password-reset`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset OTP sent to your email"
}
```

---

### 6. Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

---

## User Profile Endpoints

**All endpoints require Authentication header:**
```
Authorization: Bearer <token>
```

### 7. Get Profile
**GET** `/users/profile`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+254700000000",
      "avatarUrl": "https://..."
    },
    "addresses": [],
    "userRoles": [{ "role": "CUSTOMER" }]
  }
}
```

---

### 8. Update Profile
**PUT** `/users/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254700000000",
  "avatarUrl": "https://..."
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": { ... }
  }
}
```

---

### 9. Add Address
**POST** `/users/addresses`

**Request Body:**
```json
{
  "street": "123 Main St",
  "city": "Nairobi",
  "state": "Nairobi",
  "postalCode": "00100",
  "country": "Kenya"
}
```

**Response:**
```json
{
  "message": "Address added successfully",
  "address": {
    "id": "uuid",
    "street": "123 Main St",
    "city": "Nairobi",
    "state": "Nairobi",
    "postalCode": "00100",
    "country": "Kenya"
  }
}
```

---

### 10. Update Address
**PUT** `/users/addresses/:id`

**Request Body:**
```json
{
  "street": "456 New St",
  "city": "Mombasa"
}
```

**Response:**
```json
{
  "message": "Address updated successfully",
  "address": { ... }
}
```

---

### 11. Delete Address
**DELETE** `/users/addresses/:id`

**Response:**
```json
{
  "message": "Address deleted successfully"
}
```

---

### 12. Upload Avatar
**POST** `/users/upload-avatar`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `avatar`: File

**Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "url": "https://ik.imagekit.io/...",
  "fileId": "..."
}
```

---

## Product Endpoints

### 13. Get All Products (Public)
**GET** `/products`

**Query Parameters:**
- `category`: Filter by category
- `search`: Search by name/description
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Description",
      "price": 1999.99,
      "category": "MEN",
      "sizes": ["S", "M", "L"],
      "colors": ["Black", "White"],
      "images": ["https://..."],
      "stock": 50,
      "brand": "Brand Name"
    }
  ]
}
```

---

### 14. Get Single Product (Public)
**GET** `/products/:id`

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "name": "Product Name",
    ...
  }
}
```

---

### 15. Create Product (Admin Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 2999.99,
  "category": "MEN",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Black", "Blue", "White"],
  "images": ["https://..."],
  "stock": 100,
  "brand": "Nike"
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": { ... }
}
```

---

### 16. Update Product (Admin Only)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "price": 2499.99,
  "stock": 75
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

---

### 17. Delete Product (Admin Only)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 18. Upload Product Image (Admin Only)
**POST** `/products/upload-image`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: File

**Response:**
```json
{
  "message": "Product image uploaded successfully",
  "url": "https://ik.imagekit.io/...",
  "fileId": "..."
}
```

---

## Order Endpoints

**Requires Authentication:**

### 19. Create Order
**POST** `/orders`

**Request Body:**
```json
{
  "addressId": "uuid",
  "paymentMethod": "MPESA",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "size": "M",
      "color": "Black",
      "price": 1999.99
    }
  ],
  "mpesaPhoneNumber": "+254700000000",
  "notes": "Please deliver before 5pm"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-2024-001",
    "total": 3999.98,
    "status": "PENDING"
  }
}
```

---

### 20. Get User Orders
**GET** `/orders`

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2024-001",
      "status": "DELIVERED",
      "total": 3999.98,
      "items": [...],
      "address": {...}
    }
  ]
}
```

---

### 21. Update Order Status (Admin Only)
**PUT** `/orders/:id/status`

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Response:**
```json
{
  "message": "Order status updated successfully",
  "order": { ... }
}
```

---

## Payment Endpoints

### 22. Initiate M-Pesa Payment
**POST** `/payments/mpesa`

**Request Body:**
```json
{
  "orderId": "uuid",
  "phoneNumber": "+254700000000",
  "amount": 3999.98
}
```

**Response:**
```json
{
  "message": "Payment successful (simulated)",
  "payment": {
    "transactionId": "MPY1A2B3C4D5E",
    "mpesaReceiptNumber": "MP1234567890",
    "amount": 3999.98,
    "status": "COMPLETED"
  }
}
```

---

### 23. Get Payment Status
**GET** `/payments/:transactionId`

**Response:**
```json
{
  "payment": {
    "id": "uuid",
    "transactionId": "MPY1A2B3C4D5E",
    "amount": 3999.98,
    "status": "COMPLETED",
    "order": { ... }
  }
}
```

---

## Admin Analytics Endpoints

### 24. Get Dashboard Stats
**GET** `/admin/analytics/stats`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "stats": {
    "totalRevenue": 125000.50,
    "totalOrders": 150,
    "totalCustomers": 75,
    "totalProducts": 50,
    "recentOrders": [...],
    "topProducts": [...],
    "revenueByCategory": {
      "MEN": 50000,
      "WOMEN": 45000,
      "KIDS": 30000
    }
  }
}
```

---

### 25. Get All Customers (Admin Only)
**GET** `/admin/customers`

**Response:**
```json
{
  "customers": [
    {
      "id": "uuid",
      "email": "customer@example.com",
      "profile": {...},
      "totalOrders": 5,
      "totalSpent": 15000
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid data",
  "details": [...]
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Testing Notes

1. **Admin Credentials (from seed):**
   - Email: `admin@ndula.com`
   - Password: `Admin@123456`

2. **Customer Test Flow:**
   - Sign up → Verify OTP → Login → Create order → Make payment

3. **Admin Test Flow:**
   - Login → View analytics → Manage products → View orders → Update order status

4. **M-Pesa Simulation:**
   - All M-Pesa payments are automatically successful in development
   - Transaction ID format: `MPY{timestamp}{random}`
   - Receipt number format: `MP{timestamp}`
