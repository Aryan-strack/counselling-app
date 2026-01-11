# Counseling App - Comprehensive Project Report

## Project Overview

This is a full-stack counseling application built with React (frontend) and Node.js/Express (backend). The application facilitates online counseling sessions between students and counselors, with real-time chat functionality, payment integration, and administrative features.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Real-time Communication**: Socket.io-client
- **Payment**: Stripe integration
- **Form Handling**: React Hook Form with Zod validation

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Redis session storage
- **Real-time Communication**: Socket.io
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Payment Processing**: Stripe
- **Validation**: Zod

## Key Features

### 1. User Authentication & Authorization
- **Multi-role System**: Students, Counselors, and Admins
- **Registration**: Separate registration flows for students and counselors
- **Email Verification**: Token-based email verification
- **Password Reset**: Email-based password reset functionality
- **Session Management**: Redis-based session storage

### 2. Real-time Chat System
- **WebSocket Communication**: Socket.io for real-time messaging
- **File Sharing**: Support for PDF, Word, Excel, and image files
- **Message History**: Persistent message storage
- **Online Status**: Real-time user status tracking
- **Session-based Chat**: Chat only enabled during scheduled sessions

### 3. Counseling Session Management
- **Session Scheduling**: Counselors can create counseling sessions
- **Time-based Access**: Chat only available during scheduled times
- **Payment Integration**: Stripe payment processing
- **Session Duration Tracking**: Real-time countdown timers

### 4. Profile Management
- **Student Profiles**: Basic profile information
- **Counselor Profiles**: Extended profiles with education, experience, and payment details
- **File Uploads**: Profile pictures and document uploads
- **Profile Updates**: Real-time profile editing

### 5. Admin Dashboard
- **User Management**: View and manage students and counselors
- **Book Library**: Upload and manage educational materials
- **System Monitoring**: Overview of all users and activities

### 6. Book Library
- **Educational Resources**: PDF books and materials
- **File Management**: Upload, view, and download books
- **Admin Control**: Only admins can upload books

## Technical Implementation

### Database Schema

#### User Model
```javascript
{
  personalInfo: {
    name: String,
    email: String,
    password: String (hashed)
  },
  role: String, // "student", "counselor", "admin"
  profile: String, // profile image path
  counselor: ObjectId, // reference to counselor profile
  friends: [ObjectId], // array of connected users
  status: String, // "active", "disabled"
  Token: String, // for password reset
  TokenExpires: Date
}
```

#### Counselor Profile Model
```javascript
{
  education: {
    degree: String,
    institution: String,
    experience: String,
    description: String
  },
  payment: {
    accountNumber: String,
    bankName: String,
    branchCode: String
  },
  file: String // certificate/document path
}
```

#### Message Model
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  image: String, // image file path
  file: String, // file path
  createdAt: Date
}
```

### API Endpoints

#### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/register/verify/:token` - Email verification
- `GET /api/user` - Get user data
- `POST /api/email-reset` - Request password reset
- `POST /api/password-reset` - Reset password

#### Messaging
- `POST /api/send/:id` - Send message
- `GET /api/get/:id` - Get messages

#### Counseling Sessions
- `POST /api/counseling-schedule` - Create counseling session
- `GET /api/counseling-schedule/:id` - Get session details
- `POST /api/buy-advice` - Purchase counseling session

#### Profile Management
- `GET /api/profile` - Get user profile
- `POST /api/update-profile` - Update counselor profile
- `POST /api/update-student-profile` - Update student profile

## Identified Issues and Errors

### 1. Critical Issues

#### Authentication Bypass (HIGH PRIORITY)
**File**: `counselling-app/server/controller/auth.js` (Lines 30-40)
```javascript
// Password comparison is commented out!
// const isMatch = await bcryptjs.compare(
//   password,
//   user.personalInfo.password
// );
```
**Impact**: Users can login with any password
**Fix**: Uncomment and implement proper password verification

#### Missing Environment Variables
**Files**: Multiple files use `process.env` variables
**Missing Variables**:
- `MONGODB_STRING`
- `JWT_SECRET_KEY`
- `REDIS_STRING`
- `EMAIL`
- `G_PASS`
- `STRIPE_SECRET_KEY`

**Impact**: Application will not function without these variables

### 2. Security Issues

#### Hardcoded Stripe Key
**File**: `counselling-app/client/vite.config.js` (Line 12)
```javascript
const STRIPE_PUBLIC_KEY = "pk_test_51QgSIrJck1ciEtaqRPwuppgQeiO8lSuMgIvrLXpKuzCXr1MlMbP1Pjs1EH9ufxHBW6KsoAz1F3U1RcrEEN0i7pQ000WJXd8tnT";
```
**Impact**: Sensitive key exposed in client code
**Fix**: Move to environment variables

#### CORS Configuration
**File**: `counselling-app/server/app.js` (Lines 23-38)
**Issue**: Hardcoded allowed origins
**Fix**: Use environment variables for origins

### 3. Code Quality Issues

#### Unused Code
**File**: `counselling-app/client/src/context/Context.jsx`
- Commented out reducer code
- Unused state variables

#### Inconsistent Error Handling
**Files**: Multiple controller files
**Issue**: Inconsistent error response formats
**Example**: Some return `{message, success}`, others return different formats

#### Memory Leaks
**File**: `counselling-app/client/src/components/Dashboard/Chat/MessageInput.jsx`
**Issue**: Socket connections not properly cleaned up in all scenarios

### 4. UI/UX Issues

#### Responsive Design
**File**: `counselling-app/client/src/components/Dashboard/SideBar/Side-Bar.jsx`
**Issue**: Mobile responsiveness could be improved

#### Loading States
**Files**: Multiple components
**Issue**: Inconsistent loading state handling

### 5. Database Issues

#### Schema Validation
**File**: `counselling-app/server/model/User.js`
**Issue**: Missing required field validation
**Example**: `personalInfo.name` should be required

#### File Path Handling
**File**: `counselling-app/server/controller/message.js` (Lines 11-12)
**Issue**: Hardcoded path splitting
```javascript
const image = req.files?.chatImage?.[0]?.path.split("\\chat\\")[1];
```
**Impact**: Will break on different operating systems

## Dependencies Analysis

### Frontend Dependencies
- **React**: ^18.3.1 (Latest stable)
- **Vite**: ^7.0.4 (Latest)
- **Tailwind CSS**: ^3.4.17 (Latest)
- **Socket.io-client**: ^4.8.0 (Latest)
- **Stripe**: ^5.5.0 (Latest)

### Backend Dependencies
- **Express**: ^4.21.0 (Latest)
- **Mongoose**: ^8.6.3 (Latest)
- **Socket.io**: ^4.8.0 (Latest)
- **Redis**: ^4.7.0 (Latest)
- **Stripe**: ^17.5.0 (Latest)

### Security Dependencies
- **bcryptjs**: ^2.4.3 (Latest)
- **jsonwebtoken**: ^9.0.2 (Latest)
- **cors**: ^2.8.5 (Latest)

## Performance Considerations

### Frontend
- **Code Splitting**: Not implemented
- **Lazy Loading**: Not implemented
- **Image Optimization**: Not implemented
- **Bundle Size**: Could be optimized

### Backend
- **Caching**: Redis used for sessions only
- **Database Indexing**: Not optimized
- **File Storage**: Local storage (not scalable)

## Deployment Configuration

### Frontend
- **Build Tool**: Vite
- **Output**: `dist/` directory
- **Static Files**: Served from `public/` directory

### Backend
- **Port**: 3000 (configurable via environment)
- **Static Files**: Served from `public/` directory
- **Database**: MongoDB connection required
- **Redis**: Required for session management

## Recommendations

### Immediate Fixes (Critical)
1. **Fix Authentication**: Uncomment password verification
2. **Environment Variables**: Create proper `.env` files
3. **Security**: Move sensitive keys to environment variables
4. **File Paths**: Use `path.join()` for cross-platform compatibility

### Short-term Improvements
1. **Error Handling**: Standardize error response formats
2. **Input Validation**: Add comprehensive validation
3. **Logging**: Implement proper logging system
4. **Testing**: Add unit and integration tests

### Long-term Enhancements
1. **Code Splitting**: Implement lazy loading
2. **Caching**: Add Redis caching for frequently accessed data
3. **File Storage**: Move to cloud storage (AWS S3, etc.)
4. **Monitoring**: Add application monitoring
5. **CI/CD**: Implement continuous integration/deployment

## File Structure Summary

```
counselling-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # State management
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                 # Node.js backend
│   ├── controller/        # Route handlers
│   ├── model/            # Database models
│   ├── middleware/       # Custom middleware
│   ├── router/           # Route definitions
│   └── utils/            # Utility functions
└── package.json          # Root package.json
```

## Conclusion

The counseling app is a well-structured full-stack application with good separation of concerns and modern technology stack. However, it has several critical security and configuration issues that need immediate attention. The codebase shows good understanding of React and Node.js patterns, but requires refinement in error handling, security, and deployment configuration.

**Priority Actions:**
1. Fix authentication bypass immediately
2. Set up proper environment configuration
3. Implement comprehensive error handling
4. Add input validation and security measures
5. Create proper deployment documentation

The application has strong potential but needs these critical fixes before production deployment.
