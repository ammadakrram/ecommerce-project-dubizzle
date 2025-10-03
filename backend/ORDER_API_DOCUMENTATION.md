# Order API Documentation - Postman Testing Guide

## 🎯 Overview
Complete order fulfillment system with user orders and admin management.

---

## 📋 **TESTING PREREQUISITES**

1. **Create a user account** (if not already):
   ```
   POST /api/auth/signup
   Body: { "name": "Test User", "email": "test@example.com", "password": "123456" }
   ```

2. **Login and get token**:
   ```
   POST /api/auth/login
   Body: { "email": "test@example.com", "password": "123456" }
   Save the token from response!
   ```

3. **Add items to cart**:
   ```
   POST /api/cart
   Headers: Authorization: Bearer {your_token}
   Body: {
     "productId": "product-uuid",
     "quantity": 2,
     "size": "M",
     "color": "Black"
   }
   ```

---

## 📮 **POSTMAN COLLECTION: Order Management**

### **FOLDER 1: User Order Operations**

---

### ✅ Request 1.1: Create Order from Cart
```
Name: Create Order
Method: POST
URL: http://localhost:5000/api/orders

Headers:
├─ Content-Type | application/json
├─ Authorization | Bearer {your_token}

Body (raw JSON):
{
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "phone": "+1234567890"
  },
  "paymentMethod": "stripe"
}

Description: Creates order from user's cart items
Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "shippingAddress": {...},
    "subtotal": "290.00",
    "discount": "0.00",
    "deliveryFee": "15.00",
    "total": "305.00",
    "orderStatus": "pending",
    "isPaid": false,
    "items": [...]
  },
  "message": "Order created successfully"
}

Notes:
- Cart must have items
- All shipping address fields are required
- Cart will be cleared after order creation
- Product stock will be reduced
```

---

### ✅ Request 1.2: Get My Orders
```
Name: Get My Orders
Method: GET
URL: http://localhost:5000/api/orders

Headers:
├─ Authorization | Bearer {your_token}

Query Parameters: (all optional)
├─ page | 1
├─ limit | 10
├─ status | pending

Description: Get all orders for logged-in user
Expected Response:
{
  "success": true,
  "count": 5,
  "total": 15,
  "page": 1,
  "pages": 2,
  "data": [...]
}

Valid status values: pending, processing, shipped, delivered, cancelled
```

---

### ✅ Request 1.3: Get Single Order
```
Name: Get Order by ID
Method: GET
URL: http://localhost:5000/api/orders/{order_id}

Headers:
├─ Authorization | Bearer {your_token}

Description: Get detailed information about a specific order
Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "shippingAddress": {...},
    "subtotal": "290.00",
    "discount": "0.00",
    "deliveryFee": "15.00",
    "total": "305.00",
    "orderStatus": "pending",
    "isPaid": false,
    "items": [...],
    "User": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

Notes:
- Replace {order_id} with actual order UUID
- User can only view their own orders
```

---

### ✅ Request 1.4: Update Order to Paid
```
Name: Mark Order as Paid
Method: PUT
URL: http://localhost:5000/api/orders/{order_id}/pay

Headers:
├─ Content-Type | application/json
├─ Authorization | Bearer {your_token}

Body (raw JSON):
{
  "id": "stripe_payment_id_123",
  "status": "succeeded",
  "update_time": "2025-01-01T12:00:00.000Z",
  "email_address": "customer@example.com"
}

Description: Update order payment status (after Stripe payment)
Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "isPaid": true,
    "paidAt": "2025-01-01T12:00:00.000Z",
    "orderStatus": "processing",
    "paymentResult": {...}
  },
  "message": "Payment successful"
}

Notes:
- Order status changes to 'processing' after payment
- Payment info is stored in paymentResult
```

---

### ✅ Request 1.5: Cancel Order
```
Name: Cancel Order
Method: PUT
URL: http://localhost:5000/api/orders/{order_id}/cancel

Headers:
├─ Authorization | Bearer {your_token}

Body: None

Description: Cancel an order (restores product stock)
Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderStatus": "cancelled"
  },
  "message": "Order cancelled successfully"
}

Notes:
- Cannot cancel delivered orders
- Product stock is restored
- Can only cancel your own orders
```

---

## **FOLDER 2: Admin Order Operations**

⚠️ **Important**: For admin routes, you need an admin user token!

### Create Admin User (One-time setup):
You'll need to manually update a user's role to 'admin' in the database:
```sql
UPDATE "Users" SET role = 'admin' WHERE email = 'admin@example.com';
```

---

### ✅ Request 2.1: Get All Orders (Admin)
```
Name: Get All Orders (Admin)
Method: GET
URL: http://localhost:5000/api/orders/admin/all

Headers:
├─ Authorization | Bearer {admin_token}

Query Parameters: (all optional)
├─ page | 1
├─ limit | 10
├─ status | pending
├─ userId | user-uuid

Description: Get all orders in the system (admin only)
Expected Response:
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "id": "order-uuid",
      "userId": "user-uuid",
      "total": "305.00",
      "orderStatus": "pending",
      "User": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [...]
    }
  ]
}

Notes:
- Requires admin privileges
- Can filter by status or userId
```

---

### ✅ Request 2.2: Update Order Status (Admin)
```
Name: Update Order Status (Admin)
Method: PUT
URL: http://localhost:5000/api/orders/{order_id}/status

Headers:
├─ Content-Type | application/json
├─ Authorization | Bearer {admin_token}

Body (raw JSON):
{
  "orderStatus": "shipped"
}

Description: Update order status (admin only)
Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderStatus": "shipped",
    "items": [...],
    "User": {...}
  },
  "message": "Order status updated to shipped"
}

Valid orderStatus values:
- pending
- processing
- shipped
- delivered
- cancelled

Notes:
- Requires admin privileges
- deliveredAt is auto-set when status changes to 'delivered'
```

---

### ✅ Request 2.3: Get Order Statistics (Admin)
```
Name: Get Order Stats (Admin)
Method: GET
URL: http://localhost:5000/api/orders/admin/stats

Headers:
├─ Authorization | Bearer {admin_token}

Description: Get order statistics dashboard data
Expected Response:
{
  "success": true,
  "data": {
    "totalOrders": 50,
    "ordersByStatus": {
      "pending": 10,
      "processing": 15,
      "shipped": 12,
      "delivered": 10,
      "cancelled": 3
    },
    "totalRevenue": "15250.00",
    "recentOrders": [...]
  }
}

Notes:
- Requires admin privileges
- totalRevenue includes only paid orders
- recentOrders shows last 5 orders
```

---

## 🔄 **COMPLETE ORDER FLOW (Testing Scenario)**

### **Scenario: User Orders a Product**

**Step 1: User adds items to cart**
```
POST /api/cart
Authorization: Bearer {user_token}
Body: {
  "productId": "product-uuid",
  "quantity": 2,
  "size": "L",
  "color": "Blue"
}
```

**Step 2: User creates order from cart**
```
POST /api/orders
Authorization: Bearer {user_token}
Body: {
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "phone": "+1234567890"
  }
}
```

**Step 3: User pays for order** (simulated)
```
PUT /api/orders/{order_id}/pay
Authorization: Bearer {user_token}
Body: {
  "id": "stripe_pi_123",
  "status": "succeeded",
  "update_time": "2025-01-01T12:00:00Z",
  "email_address": "john@example.com"
}
```

**Step 4: Admin updates order status**
```
PUT /api/orders/{order_id}/status
Authorization: Bearer {admin_token}
Body: { "orderStatus": "processing" }
```

**Step 5: Admin ships the order**
```
PUT /api/orders/{order_id}/status
Authorization: Bearer {admin_token}
Body: { "orderStatus": "shipped" }
```

**Step 6: Admin marks as delivered**
```
PUT /api/orders/{order_id}/status
Authorization: Bearer {admin_token}
Body: { "orderStatus": "delivered" }
```

**Step 7: User views order history**
```
GET /api/orders
Authorization: Bearer {user_token}
```

---

## 🛠 **ERROR HANDLING**

### Common Errors:

**1. Empty Cart**
```json
{
  "success": false,
  "message": "Your cart is empty"
}
```

**2. Insufficient Stock**
```json
{
  "success": false,
  "message": "Insufficient stock for Product Name. Only 5 available"
}
```

**3. Missing Shipping Address**
```json
{
  "success": false,
  "message": "Please provide complete shipping address"
}
```

**4. Unauthorized (no token)**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**5. Not Admin**
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

**6. Order Not Found**
```json
{
  "success": false,
  "message": "Order not found"
}
```

**7. Cannot Cancel Delivered Order**
```json
{
  "success": false,
  "message": "Cannot cancel delivered order"
}
```

---

## 📊 **ORDER STATUS FLOW**

```
pending → processing → shipped → delivered
   ↓
cancelled (can cancel at any stage except delivered)
```

---

## ✅ **TESTING CHECKLIST**

**User Operations:**
- [ ] Create order from cart
- [ ] Get my orders (empty)
- [ ] Get my orders (with data)
- [ ] Get single order by ID
- [ ] Update order to paid
- [ ] Cancel pending order
- [ ] Try to cancel delivered order (should fail)
- [ ] Try to view another user's order (should fail)

**Admin Operations:**
- [ ] Get all orders
- [ ] Filter orders by status
- [ ] Filter orders by userId
- [ ] Update order status (pending → processing)
- [ ] Update order status (processing → shipped)
- [ ] Update order status (shipped → delivered)
- [ ] Get order statistics
- [ ] Verify deliveredAt is set when status is 'delivered'

**Edge Cases:**
- [ ] Create order with empty cart (should fail)
- [ ] Create order without shipping address (should fail)
- [ ] Try to pay for already paid order (should fail)
- [ ] Cancel order and verify stock is restored
- [ ] Verify cart is cleared after order creation

---

## 💡 **TIPS**

1. **Save Tokens**: Store user and admin tokens in Postman environment variables
2. **Save Order IDs**: After creating an order, save the ID for subsequent tests
3. **Test Flow**: Follow the complete order flow scenario for end-to-end testing
4. **Check Database**: Verify stock changes and cart clearing in database
5. **Admin Setup**: Create an admin user before testing admin endpoints

---

## 🎯 **QUICK REFERENCE**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/orders` | POST | User | Create order from cart |
| `/api/orders` | GET | User | Get my orders |
| `/api/orders/:id` | GET | User | Get single order |
| `/api/orders/:id/pay` | PUT | User | Mark as paid |
| `/api/orders/:id/cancel` | PUT | User | Cancel order |
| `/api/orders/admin/all` | GET | Admin | Get all orders |
| `/api/orders/admin/stats` | GET | Admin | Get statistics |
| `/api/orders/:id/status` | PUT | Admin | Update status |

---

## 🚀 **READY TO TEST!**

1. Import these requests into Postman
2. Set up environment with base_url and tokens
3. Follow the complete order flow scenario
4. Test all edge cases
5. Verify database changes

Happy testing! 🎉
