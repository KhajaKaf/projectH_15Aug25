# KK's Empire Backend Implementation Contracts

## Database Schema (Prisma + Neon Postgres)

### Models
- **Category**: id, name, displayOrder, createdAt
- **MenuItem**: id, name, price, image, categoryId, isAvailable, createdAt
- **Table**: id, number, qrCode, status (available|occupied|reserved), createdAt
- **Order**: id, tableId, customerPhone, subtotal, tax, total, status, estimatedTime, createdAt
- **OrderItem**: id, orderId, menuItemId, quantity, unitPrice, totalPrice
- **OrderEvent**: id, orderId, status, notes, createdAt (audit trail)

### Seed Data
- All menu categories and items from `/app/frontend/src/mock.js`
- Sample tables (T01-T10) with QR codes

## API Contracts

### Table Session
```
POST /api/tables/session
Body: { tableNumber: "T01" }
Response: { tableId, groupId, tableNumber }
Sets httpOnly cookie: table_session
```

### Menu API
```
GET /api/menu
Response: {
  categories: [{ id, name, items: [{ id, name, price, image }] }]
}
```

### Order Management
```
POST /api/orders
Body: { 
  tableId: string,
  customerPhone: string,
  items: [{ menuItemId, quantity }]
}
Response: { orderId, status: "new", total, estimatedTime }
Triggers: Pusher "order-created" event
```

```
PATCH /api/orders/:id/status
Body: { status: "confirmed|in_progress|ready|served|rejected", etaMinutes?: number }
Response: { success: true }
Triggers: Pusher "order-status-updated" event + Twilio SMS if confirmed
```

## Real-time Events (Pusher)

### Channels
- `private-admin`: All orders for manager dashboard
- `private-table-{tableId}`: Order updates for specific table

### Events
- `order-created`: New order placed
- `order-status-updated`: Status change by manager

## Integration Points

### Frontend Changes Required
1. Remove all mock data imports
2. Replace mock API calls with actual fetch to backend routes
3. Add Pusher client for real-time updates
4. Update cart to use actual API responses

### Backend Services
1. **Pusher**: Real-time order updates
2. **Twilio**: SMS notifications on order confirmation
3. **Cloudinary**: Image storage and optimization
4. **Razorpay**: Payment processing (stubbed)

## Migration Strategy
1. Set up Prisma schema and database
2. Create and run migrations
3. Implement API routes one by one
4. Add real-time functionality
5. Integrate external services
6. Update frontend to remove mocks
7. Test complete flow

## Testing Protocol
1. Database seeding works correctly
2. Table session creation and validation
3. Menu fetching from database
4. Order creation with proper validation
5. Real-time updates trigger correctly
6. SMS notifications sent on confirmation
7. Manager dashboard updates in real-time
8. Payment flow (stubbed) works

## File Structure
```
/app/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── lib/
│   ├── prisma.js
│   ├── pusher.js
│   └── services/
├── app/api/
│   ├── menu/route.js
│   ├── tables/session/route.js
│   ├── orders/
│   └── webhooks/
└── app/admin/
    └── page.js
```