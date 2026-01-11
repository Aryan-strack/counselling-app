# Stripe Test Mode Configuration

## Server-side (.env)
Add these test keys to your `server/.env` file:

```env
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx  # Replace with your test secret key
```

## Client-side (Vite .env)
Create or update `client/.env` with:

```env
# Stripe Test Mode Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_51xxxxxxxxxxxxx  # Replace with your test publishable key
```

## Getting Test Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## Test Card Numbers
Use these test cards for payments:

### Success
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### Decline
- **Card Number:** 4000 0000 0000 0002
- All other fields: same as above

### Requires Authentication (3D Secure)
- **Card Number:** 4000 0025 0000 3155
- All other fields: same as above

## Important Notes
- Test mode data is completely separate from live mode
- No real money is processed in test mode
- Always use `sk_test_` and `pk_test_` keys for development
- Never commit real API keys to version control
