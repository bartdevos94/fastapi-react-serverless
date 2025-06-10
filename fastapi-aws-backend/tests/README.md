# 🚀 FastAPI Backend

A modern **FastAPI** backend application designed for AWS Lambda deployment with Cognito authentication, DynamoDB storage, and S3 file upload capabilities.

## 🌟 **Features**

- ✅ **FastAPI Framework** with automatic API documentation
- ✅ **AWS Cognito Authentication** (JWT tokens)
- ✅ **DynamoDB Integration** for user data storage
- ✅ **S3 File Upload** with presigned URLs
- ✅ **CORS Configuration** for frontend integration
- ✅ **Environment-based Configuration**
- ✅ **Comprehensive Error Handling**
- ✅ **Input Validation** with Pydantic
- ✅ **Health Check Endpoints**
- ✅ **AWS Lambda Optimized**

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │  Lambda Function│
│   (React)       │───►│     (HTTP)       │───►│    (FastAPI)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                       ┌─────────────────┐              │
                       │  Cognito User   │◄─────────────┤
                       │     Pool        │              │
                       │ (Authentication)│              │
                       └─────────────────┘              │
                                                        │
                       ┌─────────────────┐              │
                       │   DynamoDB      │◄─────────────┤
                       │     Table       │              │
                       │  (User Data)    │              │
                       └─────────────────┘              │
                                                        │
                       ┌─────────────────┐              │
                       │   S3 Bucket     │◄─────────────┘
                       │ (File Storage)  │
                       └─────────────────┘
```

## 📁 **Project Structure**

```
fastapi-aws-backend/
├── README.md                    # This file
├── requirements.txt             # Python dependencies
├── requirements-dev.txt         # Development dependencies
├── template.yaml               # SAM template (reference)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── app/                        # Main application
│   ├── __init__.py
│   ├── main.py                 # FastAPI app and Lambda handler
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   └── v1/                 # API version 1
│   │       ├── __init__.py
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── users.py        # User management endpoints
│   │       └── files.py        # File upload endpoints
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py           # Configuration settings
│   │   ├── security.py         # Authentication helpers
│   │   └── exceptions.py       # Custom exceptions
│   ├── models/                 # Data models
│   │   ├── __init__.py
│   │   ├── user.py            # User models
│   │   └── file.py            # File models
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py     # Authentication service
│   │   ├── user_service.py     # User management service
│   │   └── file_service.py     # File management service
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       ├── aws.py             # AWS service helpers
│       └── validators.py       # Input validators
├── tests/                      # Test suite
│   ├── __init__.py
│   ├── conftest.py            # Test configuration
│   ├── test_auth.py           # Authentication tests
│   ├── test_users.py          # User endpoint tests
│   └── test_files.py          # File upload tests
└── .github/                   # GitHub workflows
    └── workflows/
        └── deploy.yml         # CI/CD pipeline
```

## 🛠️ **Local Development Setup**

### **Prerequisites**
- Python 3.11+
- AWS Account (for testing with real services)

### **1. Clone and Setup**

```bash
# Navigate to backend directory
cd fastapi-aws-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### **2. Configure Environment**

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your AWS values
# See Configuration section below
```

### **3. Run Development Server**

```bash
# Start FastAPI development server
uvicorn app.main:app --reload --port 8000

# Or use the convenience script
python -m app.main
```

### **4. Access API Documentation**

- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env` file in the project root:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Cognito Configuration (from AWS Console)
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=my-app-users

# Application Configuration
ENVIRONMENT=dev
LOG_LEVEL=INFO

# CORS Configuration
CORS_ORIGINS=https://your-cloudfront-url.cloudfront.net,http://localhost:3000

# S3 Configuration (optional - for file uploads)
S3_BUCKET_NAME=my-app-files-bucket
```

### **Getting Configuration Values**

After deploying via AWS Console (see [DEPLOYMENT.md](../DEPLOYMENT.md)):

1. **Cognito Values**:
   - Go to Cognito Console → User Pools
   - Copy User Pool ID and App Client ID

2. **DynamoDB Table**:
   - Use the table name you created

3. **AWS Region**:
   - Use the region where you deployed resources

## 🚀 **Deployment**

### **Manual Console Deployment (Recommended)**

Follow the complete guide in [DEPLOYMENT.md](../DEPLOYMENT.md) for step-by-step AWS Console deployment.

**Quick Overview:**
1. Create Lambda function in AWS Console
2. Upload your code as ZIP file
3. Configure environment variables
4. Set up API Gateway integration
5. Configure IAM permissions

### **Package for Lambda**

To create a deployment package:

```bash
# Create deployment ZIP
zip -r backend-code.zip app/ requirements.txt

# Upload to Lambda via AWS Console
# Or upload to S3 for larger packages
```

### **CI/CD with GitHub Actions**

The repository includes GitHub Actions workflows for automated deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend
on:
  push:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to AWS
        # See full workflow file for details
```

**Setup Requirements:**
- Add AWS credentials to GitHub Secrets
- Configure environment-specific branches
- Update stack names in workflow

## 🧪 **Testing**

### **Run Tests Locally**

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Run tests and generate HTML coverage report
pytest --cov=app --cov-report=html
```

### **Test Categories**

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints with mocked AWS services
- **Authentication Tests**: Test Cognito integration
- **Database Tests**: Test DynamoDB operations

### **Test Configuration**

Tests use pytest fixtures for setup:

```python
# tests/conftest.py
@pytest.fixture
def test_client():
    return TestClient(app)

@pytest.fixture
def mock_cognito():
    # Mock Cognito responses
    pass
```

## 📚 **API Documentation**

### **Authentication Endpoints**

```http
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/confirm
```

### **User Management Endpoints**

```http
GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
GET    /api/v1/users/{user_id}
```

### **File Upload Endpoints**

```http
POST /api/v1/files/upload-url
GET  /api/v1/files
GET  /api/v1/files/{file_id}
DELETE /api/v1/files/{file_id}
```

### **Health Check Endpoints**

```http
GET /health
GET /health/detailed
```

### **Interactive Documentation**

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔒 **Security**

### **Authentication Flow**

1. **Signup**: User creates account via Cognito
2. **Email Verification**: Cognito sends verification email
3. **Login**: Returns JWT access and refresh tokens
4. **Protected Routes**: Validate JWT tokens
5. **Refresh**: Get new access token using refresh token

### **Authorization**

```python
from app.core.security import get_current_user

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}
```

### **CORS Configuration**

Configured for cross-origin requests from frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔧 **Development Tools**

### **Code Quality**

```bash
# Format code with Black
black .

# Lint with flake8
flake8 app/ tests/

# Type checking with mypy
mypy app/

# Sort imports with isort
isort .
```

### **Pre-commit Hooks**

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run on all files
pre-commit run --all-files
```

## 📊 **Monitoring and Logging**

### **CloudWatch Integration**

- **Logs**: Automatic Lambda function logging
- **Metrics**: Request count, duration, errors
- **Alarms**: Set up for error rates and latency

### **Application Logging**

```python
import logging

logger = logging.getLogger(__name__)

@router.post("/example")
async def example_endpoint():
    logger.info("Processing request")
    try:
        # Your code here
        pass
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise
```

### **Error Tracking**

Comprehensive error handling with custom exceptions:

```python
from app.core.exceptions import ValidationError, NotFoundError

@router.get("/user/{user_id}")
async def get_user(user_id: str):
    user = await user_service.get_user(user_id)
    if not user:
        raise NotFoundError("User not found")
    return user
```

## 🐛 **Troubleshooting**

### **Common Issues**

**Lambda Cold Starts**
- Use Provisioned Concurrency for production
- Optimize package size
- Consider connection pooling

**Cognito Authentication Errors**
- Verify User Pool ID and Client ID
- Check token expiration
- Ensure proper CORS configuration

**DynamoDB Access Issues**
- Verify IAM permissions
- Check table names and regions
- Monitor read/write capacity

**CORS Errors**
- Update CORS_ORIGINS environment variable
- Check API Gateway CORS settings
- Verify request headers

### **Debugging Tips**

1. **Check CloudWatch Logs** for detailed error messages
2. **Use API Gateway Test** feature to debug endpoints
3. **Enable detailed logging** in development
4. **Test with curl** or Postman for API issues
5. **Verify AWS permissions** in IAM console

### **Performance Optimization**

```python
# Connection pooling for DynamoDB
import boto3
from boto3.dynamodb.conditions import Key

# Reuse client across invocations
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

# Use batch operations when possible
def batch_get_users(user_ids):
    response = dynamodb.batch_get_item(
        RequestItems={
            table_name: {
                'Keys': [{'user_id': uid} for uid in user_ids]
            }
        }
    )
    return response['Responses'][table_name]
```

## 🤝 **Contributing**

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and add tests**
4. **Run tests**: `pytest`
5. **Format code**: `black . && isort .`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Create Pull Request**

### **Code Standards**

- **PEP 8** compliance via Black formatter
- **Type hints** for all functions
- **Docstrings** for public functions
- **Comprehensive tests** for new features
- **Error handling** for all edge cases

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- **FastAPI** - High-performance web framework
- **AWS** - Cloud infrastructure platform
- **Pydantic** - Data validation library
- **Pytest** - Testing framework

---

**Ready to build amazing APIs with FastAPI and AWS! 🚀**