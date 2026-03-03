# Backend API Documentation

## Quick Start

The OpenUniverse backend provides REST API endpoints for the "Join Now" feature.

### Main Endpoint
```
POST /backend/apply.php
```

### Quick Test
```bash
curl -X POST http://localhost/openuniverse/backend/apply.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "contributor"
  }'
```

## Project Structure

```
backend/
├── apply.php                    # Main API endpoint
├── index.php                    # Router
├── config/
│   └── Database.php            # Database connection
├── controllers/
│   └── ApplicationController.php  # Business logic
├── middleware/
│   └── ApiResponse.php         # Response formatting
├── models/
│   └── Application.php         # Database operations
└── logs/
    └── error.log               # Error logging
```

## Configuration

### Database Setup
1. Edit `backend/config/Database.php` with your MySQL credentials
2. Run `database/schema.sql` to create tables
3. Or run the setup script: `bash setup.sh`

### Current Credentials (XAMPP Default)
```php
host: localhost
database: openuniverse
user: root
password: (empty)
```

## Endpoints

### 1. Submit Application
**Method**: POST  
**URL**: `/backend/apply.php`  
**Body**: JSON with name, email, password, role

### 2. Get Application
**Method**: GET  
**URL**: `/backend/apply.php?id=1`

### 3. Get Pending Applications
**Method**: GET  
**URL**: `/backend/apply.php?action=pending&limit=50`

### 4. Update Status
**Method**: POST  
**URL**: `/backend/apply.php?action=status`  
**Body**: JSON with application_id, status

## Response Format

### Success
```json
{
  "success": true,
  "message": "Description",
  "data": {},
  "code": 200
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "code": 400
}
```

## Security Features

✅ PDO prepared statements  
✅ Password hashing (BCRYPT)  
✅ Input validation  
✅ CORS headers  
✅ Error logging  

## For Full Documentation

See [BACKEND_JOIN_NOW.md](../BACKEND_JOIN_NOW.md) for complete details.  
See [TESTING_GUIDE.md](../TESTING_GUIDE.md) for testing examples.

## Troubleshooting

**MySQL Connection Error**
- Ensure MySQL is running
- Check credentials in `backend/config/Database.php`

**Email Already Exists**
- Use a different email address
- Check `applications` table in database

**Password Errors**
- Minimum 8 characters required
- No special character requirements, but recommended

Check logs at `backend/logs/error.log` for detailed errors.
