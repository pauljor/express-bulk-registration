#!/bin/bash

# Test script for bulk create with criteria filtering

BASE_URL="http://localhost:5000"
CSV_FILE="sample-users.csv"

echo "=== Testing Bulk Create with Criteria Filtering ==="
echo

# Step 1: Get access token
echo "1. Getting access token..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/token")
TOKEN=$(echo $TOKEN_RESPONSE | json_pp | grep -o '"access_token" : "[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get access token"
  echo "Response: $TOKEN_RESPONSE"
  exit 1
fi

echo "Access token obtained successfully"
echo "Token: ${TOKEN:0:50}..."
echo

# Step 2: Test with criteria="all"
echo "2. Testing bulk create with criteria='all'..."
echo "This should create all users from the CSV file"
echo

RESPONSE=$(curl -s -X POST "$BASE_URL/users/bulk/create" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$CSV_FILE;type=text/csv" \
  -F "criteria=all")

echo "Response:"
echo $RESPONSE | json_pp
echo
echo "---"
echo

# Wait a bit
sleep 2

# Step 3: Test with criteria="role" and role="teacher"
echo "3. Testing bulk create with criteria='role' and role='teacher'..."
echo "This should only create users with role='teacher' and skip others"
echo

RESPONSE=$(curl -s -X POST "$BASE_URL/users/bulk/create" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$CSV_FILE;type=text/csv" \
  -F "criteria=role" \
  -F "role=teacher")

echo "Response:"
echo $RESPONSE | json_pp
echo
echo "---"
echo

# Step 4: Test with criteria="role" and role="student"
echo "4. Testing bulk create with criteria='role' and role='student'..."
echo "This should only create users with role='student' and skip others"
echo

RESPONSE=$(curl -s -X POST "$BASE_URL/users/bulk/create" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$CSV_FILE;type=text/csv" \
  -F "criteria=role" \
  -F "role=student")

echo "Response:"
echo $RESPONSE | json_pp
echo
echo "---"
echo

# Step 5: Test validation - criteria="role" without role parameter
echo "5. Testing validation: criteria='role' without role parameter..."
echo "This should return a validation error"
echo

RESPONSE=$(curl -s -X POST "$BASE_URL/users/bulk/create" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$CSV_FILE;type=text/csv" \
  -F "criteria=role")

echo "Response:"
echo $RESPONSE | json_pp
echo

echo "=== Tests Completed ==="
