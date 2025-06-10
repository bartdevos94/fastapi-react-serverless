# ⚛️ React Frontend

A modern **React** frontend application built with TypeScript, Tailwind CSS, and AWS Cognito authentication, designed for deployment on AWS S3 + CloudFront.

## 🌟 **Features**

- ✅ **React 18** with TypeScript for type safety
- ✅ **Tailwind CSS** for rapid UI development
- ✅ **Redux Toolkit** for state management
- ✅ **React Router** for client-side routing
- ✅ **AWS Cognito Authentication** integration
- ✅ **File Upload** with drag & drop support
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Dark Mode** support
- ✅ **Form Validation** with React Hook Form
- ✅ **API Integration** with custom hooks
- ✅ **Error Boundaries** for graceful error handling
- ✅ **Progressive Web App** (PWA) ready

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   S3 Bucket      │    │   API Gateway   │
│     (CDN)       │───►│ (Static Files)   │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               ▲
         │              ┌─────────────────┐             │
         │              │  Cognito User   │             │
         └──────────────┤     Pool        │─────────────┘
                        │ (Authentication)│
                        └─────────────────┘
```

## 📁 **Project Structure**

```
react-aws-frontend/
├── README.md                     # This file
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML template
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── manifest.json            # PWA manifest
├── src/                         # Source code
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Main App component
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Common components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   └── forms/               # Form components
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── FileUploadForm.tsx
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── services/                # API and external services
│   │   ├── api.ts               # API client configuration
│   │   ├── auth.ts              # Authentication service
│   │   ├── users.ts             # User service
│   │   ├── files.ts             # File service
│   │   └── storage.ts           # Local storage service
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   ├── authSlice.ts         # Authentication state
│   │   ├── userSlice.ts         # User data state
│   │   └── uiSlice.ts           # UI state (theme, etc.)
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts              # Authentication types
│   │   ├── user.ts              # User types
│   │   ├── api.ts               # API response types
│   │   └── common.ts            # Common types
│   ├── utils/                   # Utility functions
│   │   ├── constants.ts         # Application constants
│   │   ├── formatters.ts        # Data formatters
│   │   ├── validators.ts        # Input validators
│   │   └── helpers.ts           # Helper functions
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # Global CSS
│   │   └── components.css       # Component-specific CSS
│   └── assets/                  # Static assets
│       ├── images/
│       ├── icons/
│       └── fonts/
├── infrastructure/              # AWS CloudFormation templates
│   ├── frontend-infrastructure.yaml
│   └── cloudfront-distribution.yaml
├── tests/                       # Test files
│   ├── setup.ts                # Test setup
│   ├── __mocks__/              # Mock files
│   └── components/             # Component tests
└── .github/                    # GitHub workflows
    └── workflows/
        └── deploy-frontend.yml # CI/CD pipeline
```

## 🛠️ **Local Development Setup**

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **1. Clone and Setup**

```bash
# Navigate to frontend directory
cd react-aws-frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

### **2. Configure Environment**

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your backend API URL
# See Configuration section below
```

### **3. Start Development Server**

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev
```

### **4. Access Application**

- **Frontend**: http://localhost:3000
- **Hot Reload**: Enabled by default

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env` file in the project root:

```env
# API Configuration (from your deployed backend)
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev

# AWS Configuration
VITE_AWS_REGION=us-east-1

# Cognito Configuration (from AWS Console)
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Configuration
VITE_APP_NAME=FastAPI React App
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_PWA=true
```

### **Getting Configuration Values**

After deploying your backend (see [DEPLOYMENT.md](../DEPLOYMENT.md)):

1. **API Gateway URL**:
   - Go to API Gateway Console
   - Copy the "Invoke URL" from your deployed API

2. **Cognito Configuration**:
   - Go to Cognito Console → User Pools
   - Copy User Pool ID and App Client ID

3. **AWS Region**:
   - Use the same region where you deployed your backend

## 🚀 **Build and Deployment**

### **Local Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build with type checking
npm run build:check
```

### **Manual S3 Deployment**

After building locally:

```bash
# Build the application
npm run build

# Upload to S3 (manual via AWS Console)
# 1. Go to your S3 bucket
# 2. Upload all files from dist/ folder
# 3. Set proper permissions
```

### **CloudFormation Infrastructure**

Deploy frontend infrastructure using AWS Console:

```bash
# Use the CloudFormation template in infrastructure/
# This creates S3 bucket + CloudFront distribution
```

### **CI/CD with GitHub Actions**

Automated deployment on git push:

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Build and deploy to S3
        # See full workflow for details
```

## 🧪 **Testing**

### **Run Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- LoginForm.test.tsx

# Run tests for changed files only
npm test -- --onlyChanged
```

### **Test Types**

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows (with Playwright)

### **Testing Tools**

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Playwright**: End-to-end testing

### **Example Test**

```typescript
// tests/components/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/forms/LoginForm'

describe('LoginForm', () => {
  it('renders login form fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })
})
```

## 🎨 **UI and Styling**

### **Tailwind CSS**

Modern utility-first CSS framework:

```tsx
// Example component with Tailwind
export const Button = ({ variant, children, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors"
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

### **Dark Mode Support**

Toggle between light and dark themes:

```tsx
// Dark mode implementation
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### **Responsive Design**

Mobile-first approach with Tailwind breakpoints:

```tsx
// Responsive layout example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    {/* Card content */}
  </div>
</div>
```

## 🔒 **Authentication Integration**

### **Cognito Authentication Flow**

```tsx
// Authentication hook
export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading } = useAppSelector(state => state.auth)
  
  const login = async (credentials: LoginCredentials) => {
    return dispatch(authSlice.actions.login(credentials))
  }
  
  const logout = async () => {
    return dispatch(authSlice.actions.logout())
  }
  
  return { user, isAuthenticated, isLoading, login, logout }
}
```

### **Protected Routes**

```tsx
// Protected route component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

### **API Integration**

```tsx
// API service with authentication
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken()
      return apiClient.request(error.config)
    }
    return Promise.reject(error)
  }
)
```

## 📱 **Progressive Web App (PWA)**

### **PWA Features**

- ✅ **Offline Support** with service worker
- ✅ **Install Prompt** for mobile devices
- ✅ **App Icons** for home screen
- ✅ **Background Sync** for offline actions
- ✅ **Push Notifications** (optional)

### **Manifest Configuration**

```json
// public/manifest.json
{
  "name": "FastAPI React App",
  "short_name": "FastAPI App",
  "description": "A modern full-stack application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "logo192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔧 **Development Tools**

### **Code Quality**

```bash
# TypeScript type checking
npm run type-check

# ESLint linting
npm run lint
npm run lint:fix

# Prettier formatting
npm run format
npm run format:check

# All quality checks
npm run quality-check
```

### **Development Scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "type-check": "tsc --noEmit"
  }
}
```

### **VS Code Extensions**

Recommended extensions for development:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Prettier - Code formatter**
- **ESLint**

## 📊 **Performance Optimization**

### **Bundle Optimization**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react']
        }
      }
    }
  }
})
```

### **Code Splitting**

```tsx
// Lazy loading for routes
const Dashboard = lazy(() => import('@/pages/DashboardPage'))
const Profile = lazy(() => import('@/pages/ProfilePage'))

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

### **Image Optimization**

```tsx
// Optimized image loading
export const OptimizedImage = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  
  return (
    <div className="relative">
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  )
}
```

## 🐛 **Troubleshooting**

### **Common Issues**

**Build Errors**
- Check TypeScript types are correct
- Verify all imports resolve correctly
- Clear node_modules and reinstall

**Environment Variables Not Loading**
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check .env file is in project root

**Authentication Issues**
- Verify Cognito configuration matches backend
- Check network requests in browser dev tools
- Ensure CORS is configured properly

**Styling Issues**
- Verify Tailwind CSS is configured correctly
- Check for CSS conflicts
- Use browser dev tools to inspect styles

### **Debugging Tips**

1. **Use React DevTools** for component debugging
2. **Check browser console** for JavaScript errors
3. **Use Network tab** to debug API calls
4. **Enable source maps** for better error traces
5. **Use Redux DevTools** for state management debugging

## 🤝 **Contributing**

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and add tests**
4. **Run quality checks**: `npm run quality-check`
5. **Test thoroughly**: `npm test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Create Pull Request**

### **Code Standards**

- **TypeScript** for all new code
- **Functional components** with hooks
- **Custom hooks** for reusable logic
- **Props interfaces** for all components
- **Comprehensive tests** for new features
- **Accessibility** considerations (WCAG guidelines)

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- **React** - Frontend JavaScript library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **AWS Cognito** - Authentication service

---

**Ready to build amazing user interfaces with React and AWS! ⚛️**