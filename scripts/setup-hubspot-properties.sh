#!/bin/bash
# One-time setup: creates the custom HubSpot contact properties needed for click tracking.
# Usage: HUBSPOT_TOKEN=<your-private-app-token> ./scripts/setup-hubspot-properties.sh

set -euo pipefail

if [ -z "${HUBSPOT_TOKEN:-}" ]; then
  echo "Error: Set HUBSPOT_TOKEN environment variable first."
  echo "Usage: HUBSPOT_TOKEN=pat-na2-xxx ./scripts/setup-hubspot-properties.sh"
  exit 1
fi

API="https://api.hubapi.com/crm/v3/properties/contacts"
AUTH="Authorization: Bearer $HUBSPOT_TOKEN"

create_property() {
  local json="$1"
  local name
  name=$(echo "$json" | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])")
  echo -n "Creating $name... "

  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API" \
    -H "$AUTH" \
    -H "Content-Type: application/json" \
    -d "$json")

  if [ "$code" = "201" ]; then
    echo "OK"
  elif [ "$code" = "409" ]; then
    echo "already exists (skipped)"
  else
    echo "FAILED (HTTP $code)"
    curl -s -X POST "$API" -H "$AUTH" -H "Content-Type: application/json" -d "$json"
    echo
  fi
}

echo "Creating HubSpot custom contact properties..."
echo

create_property '{"name":"ip_address","label":"IP Address","type":"string","fieldType":"text","groupName":"contactinformation","description":"Visitor IP from click tracking"}'
create_property '{"name":"click_source","label":"Click Source","type":"string","fieldType":"text","groupName":"contactinformation","description":"Which link was clicked"}'
create_property '{"name":"visitor_user_agent","label":"User Agent","type":"string","fieldType":"text","groupName":"contactinformation","description":"Browser user agent string"}'
create_property '{"name":"click_referrer","label":"Click Referrer","type":"string","fieldType":"text","groupName":"contactinformation","description":"HTTP referer header"}'
create_property '{"name":"first_click_timestamp","label":"First Click","type":"datetime","fieldType":"date","groupName":"contactinformation","description":"Timestamp of first tracked click"}'
create_property '{"name":"last_click_timestamp","label":"Last Click","type":"datetime","fieldType":"date","groupName":"contactinformation","description":"Timestamp of most recent tracked click"}'
create_property '{"name":"click_count","label":"Click Count","type":"number","fieldType":"number","groupName":"contactinformation","description":"Running count of tracked clicks"}'

echo
echo "Done! Now set the Cloudflare Worker secret:"
echo "  npx wrangler secret put HUBSPOT_API_TOKEN"
echo "  (paste the same token when prompted)"
