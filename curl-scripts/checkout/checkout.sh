#!/bin/bash

API="http://localhost:4741"
URL_PATH="/charge"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "charge": {
      "amount": "'"${AMOUNT}"'",
      "stripeEmail": "'"${EMAIL}"'",
      "stripeToken": "'"${ID}"'"
    }
  }'

echo
