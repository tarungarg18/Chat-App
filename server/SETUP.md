# 🔐 Authentication Setup Guide

## 📧 Email OTP Authentication Setup

### 1. Gmail App Password Setup
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" → "2-Step Verification" (enable if not already)
3. Go to "App passwords" (under 2-Step Verification)
4. Select "Mail" and "Other (Custom name)"
5. Enter "MyChat" as the app name
6. Copy the generated 16-character password

### 2. Update .env File
```env
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

## 🔑 Google OAuth Setup

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000/api/auth/google/callback`

### 2. Update .env File
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🚀 Testing the Setup

### 1. Test Email OTP
1. Start the server: `npm start`
2. Go to registration page
3. Fill in details and click "Send OTP"
4. Check your email for the OTP
5. Enter OTP and complete registration

### 2. Test Google OAuth
1. Ensure Google credentials are set in .env
2. Click "Continue with Google" button
3. Complete Google authentication
4. Should redirect back to chat app

## ⚠️ Common Issues & Solutions

### Email Not Sending
- Check if Gmail app password is correct
- Ensure 2-Step Verification is enabled
- Check if EMAIL_USER and EMAIL_PASSWORD are set correctly

### Google OAuth Not Working
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check if redirect URIs are correct
- Ensure Google+ API is enabled

### OTP Expired Error
- OTP expires in 10 minutes
- Check server logs for email sending errors
- Verify email service configuration

## 🔧 Environment Variables Reference

```env
# Required for basic functionality
MONGO_URL=mongodb://localhost:27017/chatapp
PORT=5000

# Required for email OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Required for Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Required for JWT and sessions
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Optional
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```
