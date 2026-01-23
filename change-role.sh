#!/bin/bash
# change-role.sh
# Usage: ./change-role.sh user@example.com admin my-secret

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: ./change-role.sh <email> <role> <secret>"
  echo "Example: ./change-role.sh user@example.com admin my-secret"
  exit 1
fi

EMAIL="$1"
ROLE="$2"
SECRET="$3"

# Environment variables:
# - BASE_URL: API base URL (optional, defaults to local Nest API)
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "Changing role for user: $EMAIL to: $ROLE"

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/change-role" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"role\": \"$ROLE\",
    \"secret\": \"$SECRET\"
  }")

echo "Response: $RESPONSE"

# Adjust this check to match your API's success message
if echo "$RESPONSE" | grep -q "role updated successfully"; then
  echo "✅ User $EMAIL role changed to $ROLE!"
else
  echo "❌ Failed to change user role. Check the response above for details."
fi

