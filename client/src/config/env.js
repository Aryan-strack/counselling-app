// Environment configuration utility for Vite
export const ENV = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_test_key_here'
};
