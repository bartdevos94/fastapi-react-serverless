# ⚙️ Configuration Guide

This guide covers all configuration options for the FastAPI React application, including environment variables, AWS resource setup, and deployment configuration.

## 📋 **Overview**

The application uses environment variables for configuration, with different settings for development, staging, and production environments.

## 🌍 **Environment Files**

### **Backend Configuration**
**File**: `fastapi-aws-backend/.env`

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Cognito Authentication (from AWS Console)
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=my-app-users-dev

# Application Settings
ENVIRONMENT=dev                    # dev, staging, prod
LOG_LEVEL=INFO                     # DEBUG, INFO, WARNING, ERROR
DEBUG=true                         # Enable debug mode

# CORS Configuration
CORS_ORIGINS=https://d1234567890.cloudfront.net,http://localhost:3000

# S3 File Storage (optional)
S3_BUCKET_NAME=my-app-files-dev
S3_REGION=us-east-1

# Security Settings
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Performance Settings
LAMBDA_MEMORY=512                  # MB (128-10240)
LAMBDA_TIMEOUT=30                  # seconds (1-900)
```

### **Frontend Configuration**
**File**: `react-aws-frontend/.env`

```env
# API Configuration (from your deployed backend)
VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/dev

# AWS Configuration
VITE_AWS_REGION=us-east-1

# Cognito Authentication (from AWS Console)
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Settings
VITE_APP_NAME=FastAPI React App
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development       # development, staging, production

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false

# Debug Settings
VITE_DEBUG_MODE=true
VITE_SHOW_DEBUG_INFO=false
```

## 🔧 **Getting Configuration Values**

### **From AWS Console Deployment**

After manually deploying via AWS Console (see [DEPLOYMENT.md](DEPLOYMENT.md)):

#### **1. Cognito User Pool Information**
1. Go to **Cognito Console** → **User Pools**
2. Click on your user pool
3. **Copy User Pool ID** (format: `us-east-1_XXXXXXXXX`)
4. Go to **App integration** tab
5. Click on your app client
6. **Copy Client ID** (long alphanumeric string)

#### **2. API Gateway URL**
1. Go to **API Gateway Console**
2. Click on your API
3. **Copy Invoke URL** from the stage (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/dev`)

#### **3. CloudFront Distribution**
1. Go to **CloudFront Console**
2. Click on your distribution
3. **Copy Distribution domain name** (e.g., `d1234567890.cloudfront.net`)

#### **4. S3 Bucket Names**
1. Go to **S3 Console**
2. **Note the bucket names** you created for frontend and file storage

#### **5. DynamoDB Table**
1. Go to **DynamoDB Console**
2. **Note the table name** you created for users

## 🏗️ **Environment-Specific Configuration**

### **Development Environment**

```env
# Backend (.env)
ENVIRONMENT=dev
LOG_LEVEL=DEBUG
DEBUG=true
CORS_ORIGINS=http://localhost:3000,https://dev.example.com
LAMBDA_MEMORY=256
JWT_SECRET_KEY=dev-secret-key

# Frontend (.env)
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
VITE_SHOW_DEBUG_INFO=true
VITE_ENABLE_ANALYTICS=false
```

### **Staging Environment**

```env
# Backend (.env)
ENVIRONMENT=staging
LOG_LEVEL=INFO
DEBUG=false
CORS_ORIGINS=https://staging.example.com
LAMBDA_MEMORY=512
JWT_SECRET_KEY=staging-secret-key

# Frontend (.env)
VITE_ENVIRONMENT=staging
VITE_DEBUG_MODE=false
VITE_SHOW_DEBUG_INFO=false
VITE_ENABLE_ANALYTICS=true
```

### **Production Environment**

```env
# Backend (.env)
ENVIRONMENT=prod
LOG_LEVEL=WARNING
DEBUG=false
CORS_ORIGINS=https://example.com,https://www.example.com
LAMBDA_MEMORY=1024
JWT_SECRET_KEY=super-secure-production-key

# Frontend (.env)
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
VITE_SHOW_DEBUG_INFO=false
VITE_ENABLE_ANALYTICS=true
```

## 🔒 **Security Configuration**

### **CORS Settings**

Configure Cross-Origin Resource Sharing to allow your frontend to access the backend:

```env
# Allow specific domains (recommended for production)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Allow localhost for development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Multiple environments
CORS_ORIGINS=https://yourdomain.com,https://dev.yourdomain.com,http://localhost:3000
```

### **JWT Configuration**

```env
# Use strong, random secret keys
JWT_SECRET_KEY=your-256-bit-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### **Environment Separation**

Use different AWS accounts or regions for different environments:

```env
# Development
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_DEV123456

# Production  
AWS_REGION=us-west-2
COGNITO_USER_POOL_ID=us-west-2_PROD789012
```

## 📊 **AWS Resource Configuration**

### **Lambda Function Settings**

Configure Lambda function parameters:

```env
LAMBDA_MEMORY=512        # Memory allocation (128-10240 MB)
LAMBDA_TIMEOUT=30        # Timeout in seconds (1-900)
LAMBDA_RESERVED_CONCURRENCY=10  # Reserved concurrency (optional)
```

### **DynamoDB Settings**

```env
DYNAMODB_TABLE_NAME=my-app-users-${ENVIRONMENT}
DYNAMODB_BILLING_MODE=PAY_PER_REQUEST  # or PROVISIONED
DYNAMODB_READ_CAPACITY=5               # Only for PROVISIONED
DYNAMODB_WRITE_CAPACITY=5              # Only for PROVISIONED
```

### **S3 Configuration**

```env
S3_BUCKET_NAME=my-app-files-${ENVIRONMENT}
S3_REGION=us-east-1
S3_MAX_FILE_SIZE=10485760              # 10MB in bytes
S3_ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

## 🔍 **Monitoring and Logging**

### **CloudWatch Configuration**

```env
LOG_LEVEL=INFO                         # DEBUG, INFO, WARNING, ERROR
LOG_GROUP_NAME=/aws/lambda/my-app-backend
LOG_RETENTION_DAYS=14                  # 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653

# X-Ray Tracing
ENABLE_XRAY_TRACING=true
XRAY_TRACE_ID_HEADER=X-Amzn-Trace-Id
```

### **Performance Monitoring**

```env
# Application metrics
ENABLE_METRICS=true
METRICS_NAMESPACE=FastAPI/App
CUSTOM_METRICS_ENABLED=true

# Performance settings
ENABLE_RESPONSE_COMPRESSION=true
MAX_REQUEST_SIZE=10485760              # 10MB
REQUEST_TIMEOUT=30
```

## 🌐 **Domain and SSL Configuration**

### **Custom Domain Setup**

```env
# Custom domain configuration
CUSTOM_DOMAIN=api.yourdomain.com
CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
ROUTE53_HOSTED_ZONE_ID=Z1D633PJN98FT9

# CloudFront custom domain
FRONTEND_DOMAIN=yourdomain.com
FRONTEND_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/87654321-4321-4321-4321-210987654321
```

## 🚀 **CI/CD Configuration**

### **GitHub Actions Secrets**

Required secrets in GitHub repository settings:

```
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Cognito Configuration
COGNITO_USER_POOL_ID_DEV=us-east-1_dev123456
COGNITO_CLIENT_ID_DEV=1a2b3c4d5e6f7g8h9i0j1k2l3m
COGNITO_USER_POOL_ID_PROD=us-east-1_prod789012
COGNITO_CLIENT_ID_PROD=9z8y7x6w5v4u3t2s1r0q9p8o7n
```

### **GitHub Actions Variables**

Repository variables for CI/CD:

```
# Lambda Functions
LAMBDA_FUNCTION_NAME_DEV=my-app-backend-dev
LAMBDA_FUNCTION_NAME_PROD=my-app-backend-prod

# S3 Buckets
S3_FRONTEND_BUCKET_DEV=my-app-frontend-dev-123456789
S3_FRONTEND_BUCKET_PROD=my-app-frontend-prod-123456789

# API URLs
API_GATEWAY_URL_DEV=https://dev123.execute-api.us-east-1.amazonaws.com/dev
API_GATEWAY_URL_PROD=https://prod456.execute-api.us-east-1.amazonaws.com/prod

# Frontend URLs
FRONTEND_URL_DEV=https://dev.d1234567890.cloudfront.net
FRONTEND_URL_PROD=https://d0987654321.cloudfront.net

# CloudFront Distributions
CLOUDFRONT_DISTRIBUTION_ID_DEV=E1234567890ABC
CLOUDFRONT_DISTRIBUTION_ID_PROD=E0987654321XYZ
```

## 🔧 **Local Development Configuration**

### **Development Setup**

For local development, create environment files that point to your deployed AWS resources:

```env
# Backend development
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_YOURPOOL
COGNITO_CLIENT_ID=yourclientid
DYNAMODB_TABLE_NAME=my-app-users-dev
ENVIRONMENT=dev
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=DEBUG
DEBUG=true

# Frontend development
VITE_API_URL=http://localhost:8000      # Local backend
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_YOURPOOL
VITE_COGNITO_CLIENT_ID=yourclientid
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
```

### **Testing Configuration**

For running tests:

```env
# Test environment variables
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=test-pool-id
COGNITO_CLIENT_ID=test-client-id
DYNAMODB_TABLE_NAME=test-table
ENVIRONMENT=test
DEBUG=true
LOG_LEVEL=DEBUG
```

## 🐛 **Troubleshooting Configuration**

### **Common Configuration Issues**

**CORS Errors**
- Ensure your frontend URL is in `CORS_ORIGINS`
- Check that URLs don't have trailing slashes
- Verify environment variables are loaded correctly

**Authentication Issues**
- Verify Cognito User Pool ID and Client ID match
- Check that the AWS region is correct
- Ensure Cognito User Pool allows the configured client

**Environment Variables Not Loading**
- Frontend variables must start with `VITE_`
- Check file is named exactly `.env`
- Restart development servers after changes
- Verify file is in the correct directory

**AWS Service Access Issues**
- Check IAM permissions for Lambda execution role
- Verify resource names match in all environments
- Check AWS region consistency across services

### **Validation Checklist**

Use this checklist to verify your configuration:

- [ ] All environment files created and populated
- [ ] AWS resource names match between console and config
- [ ] Cognito User Pool ID and Client ID are correct
- [ ] API Gateway URL is accessible
- [ ] CloudFront distribution is deployed
- [ ] CORS origins include all frontend URLs
- [ ] AWS regions are consistent across services
- [ ] IAM permissions are properly configured
- [ ] Environment-specific values are different
- [ ] Secrets are not committed to version control

## 📚 **Configuration References**

### **AWS Resource Naming Convention**

```
Project: my-app
Environments: dev, staging, prod

Lambda Functions:
- my-app-backend-dev
- my-app-backend-staging  
- my-app-backend-prod

DynamoDB Tables:
- my-app-users-dev
- my-app-users-staging
- my-app-users-prod

S3 Buckets:
- my-app-frontend-dev-123456789
- my-app-files-dev-123456789
- my-app-frontend-prod-123456789
- my-app-files-prod-123456789

Cognito User Pools:
- my-app-users-dev
- my-app-users-prod
```

### **Environment Variable Templates**

See the example files in the repository:
- `fastapi-aws-backend/.env.example`
- `react-aws-frontend/.env.example`

These files contain all possible configuration options with descriptions and example values.

---

**Proper configuration ensures your application runs smoothly across all environments! 🚀**