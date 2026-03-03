#!/bin/bash
# Quick Setup Script for OpenUniverse Join Now Feature
# Location: setup.sh
# Usage: bash setup.sh

echo "🚀 OpenUniverse - Join Now Feature Setup"
echo "=========================================="
echo ""

# Try to find mysql command
MYSQL_CMD=""
if command -v mysql &> /dev/null; then
    MYSQL_CMD="mysql"
elif [ -f "/Applications/XAMPP/bin/mysql" ]; then
    MYSQL_CMD="/Applications/XAMPP/bin/mysql"
else
    echo "❌ MySQL command not found. Make sure XAMPP is installed."
    exit 1
fi

# Check if MySQL is running with better error handling
echo "✓ Checking MySQL connection..."
$MYSQL_CMD -u root -e "SELECT 1" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "⚠️  MySQL connection test failed. Attempting to proceed anyway..."
    echo "   (If MySQL is running, database creation will still work)"
fi

echo "✓ Proceeding with setup..."
echo ""

# Create database if it doesn't exist
echo "✓ Creating database 'openuniverse'..."
$MYSQL_CMD -u root -e "CREATE DATABASE IF NOT EXISTS openuniverse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to create database. Ensure MySQL is running and accessible."
    exit 1
fi

echo "✓ Database created successfully"
echo ""

# Import schema
echo "✓ Importing database schema..."
$MYSQL_CMD -u root openuniverse < database/schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to import schema"
    exit 1
fi

echo "✓ Database schema imported successfully"
echo ""

# Check if logs directory exists and is writable
echo "✓ Checking backend logs directory..."
if [ ! -d "backend/logs" ]; then
    mkdir -p backend/logs
    echo "✓ Created backend/logs directory"
fi

if [ ! -w "backend/logs" ]; then
    chmod 755 backend/logs
    echo "✓ Fixed permissions for backend/logs"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Verify database connection in: backend/config/Database.php"
echo "2. Test API endpoint: POST /backend/apply.php"
echo "3. Read documentation: BACKEND_JOIN_NOW.md"
echo ""
echo "🧪 Test with cURL:"
echo "curl -X POST http://localhost/openuniverse/backend/apply.php \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"role\":\"contributor\"}'"
echo ""
