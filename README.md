# 🚀 FastAPI React Full-Stack Application

A modern, production-ready full-stack application built with **FastAPI** (backend) and **React** (frontend), deployed on **AWS** using manual console setup.

## 🌟 **Features**

- ✅ **FastAPI Backend** with automatic API documentation
- ✅ **React Frontend** with TypeScript and Tailwind CSS
- ✅ **AWS Cognito Authentication** (signup, login, email verification)
- ✅ **File Upload** with S3 integration
- ✅ **User Management** with DynamoDB
- ✅ **Global CDN** with CloudFront
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Environment-based Configuration** (dev/staging/prod)
- ✅ **GitHub CI/CD** pipelines
- ✅ **Local Development** setup

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │   API Gateway    │    │  Lambda Function│
│   (CloudFront)  │◄───┤     (HTTP)       │◄───┤    (FastAPI)    │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         │              ┌─────────────────┐             │
         └──────────────►│   S3 Bucket     │             │
                        │ (File Storage)   │             │
                        └─────────────────┘             │
                                                        │
         ┌─────────────────┐              ┌─────────────┴─────────┐
         │  Cognito User   │              │    DynamoDB Table     │
         │     Pool        │              │   (User Data)         │
         │ (Authentication)│              │                       │
         └─────────────────┘              └───────────────────────┘
```

## 🚀 **Quick Start - Manual Console Deployment**

### **Prerequisites**
- AWS Account
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### **Deployment Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fastapi-react-fullstack.git
   cd fastapi-react-fullstack
   ```

2. **Deploy using AWS Console**
   - Follow the detailed guide in [DEPLOYMENT.md](DEPLOYMENT.md)
   - Create AWS resources manually through the web console
   - No CLI tools required!

3. **Configure environment files**
   - Copy values from AWS Console to `.env` files
   - See [CONFIGURATION.md](CONFIGURATION.md) for details

4. **Test your application**
   - Frontend: Your CloudFront URL
   - Backend API: Your API Gateway URL
   - Documentation: Your API Gateway URL + `/docs`

## 📁 **Project Structure**

```
fastapi-react-fullstack/
├── README.md                          # This file
├── DEPLOYMENT.md                      # Detailed deployment guide
├── CONFIGURATION.md                   # Configuration reference
├── fastapi-aws-backend/              # Backend application
│   ├── README.md                     # Backend-specific documentation
│   ├── app/                          # FastAPI application
│   ├── tests/                        # Backend tests
│   ├── template.yaml                 # SAM template (reference)
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   └── .github/workflows/            # CI/CD for backend
└── react-aws-frontend/               # Frontend application
    ├── README.md                     # Frontend-specific documentation
    ├── src/                          # React application
    ├── public/                       # Static files
    ├── infrastructure/               # CloudFormation templates (reference)
    ├── package.json                  # Node.js dependencies
    ├── .env.example                  # Environment template
    └── .github/workflows/            # CI/CD for frontend
```

## 🛠️ **Local Development**

### **Backend Development**
```bash
cd fastapi-aws-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your AWS values
uvicorn app.main:app --reload --port 8000
```

### **Frontend Development**
```bash
cd react-aws-frontend
npm install
cp .env.example .env  # Edit with your API Gateway URL
npm run dev
```

### **Access Your Local App**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🌍 **Deployment Options**

### **Manual Console Deployment (Recommended)**
Perfect for learning and understanding AWS services:
- ✅ No CLI tools required
- ✅ Visual step-by-step process
- ✅ Full control over configuration
- ✅ Easy troubleshooting
- 📖 See [DEPLOYMENT.md](DEPLOYMENT.md)

### **CI/CD with GitHub Actions**
Automated deployment for teams:
- ✅ Automatic deployments on git push
- ✅ Environment-specific branches
- ✅ Rollback capabilities
- 📖 See [.github/workflows/](fastapi-aws-backend/.github/workflows/)

## 📚 **Documentation**

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete manual deployment guide
- **[CONFIGURATION.md](CONFIGURATION.md)** - Environment configuration reference
- **[Backend README](fastapi-aws-backend/README.md)** - Backend-specific documentation
- **[Frontend README](react-aws-frontend/README.md)** - Frontend-specific documentation

## 🔧 **Configuration**

The application uses environment variables for configuration:

### **Backend (`fastapi-aws-backend/.env`)**
```env
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
DYNAMODB_TABLE_NAME=my-app-users
ENVIRONMENT=dev
CORS_ORIGINS=https://your-cloudfront-url.cloudfront.net,http://localhost:3000
```

### **Frontend (`react-aws-frontend/.env`)**
```env
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🧪 **Testing**

### **Backend Tests**
```bash
cd fastapi-aws-backend
source venv/bin/activate
pytest
pytest --cov  # With coverage
```

### **Frontend Tests**
```bash
cd react-aws-frontend
npm test
npm run test:coverage
```

## 🚀 **Production Considerations**

- ✅ **Environment Separation**: Use different AWS accounts or regions
- ✅ **Custom Domains**: Set up Route 53 and Certificate Manager
- ✅ **Monitoring**: Enable CloudWatch logs and X-Ray tracing
- ✅ **Security**: Review IAM policies and enable WAF
- ✅ **Backup**: Configure DynamoDB backups
- ✅ **Cost Optimization**: Use reserved capacity for production workloads

## 🐛 **Troubleshooting**

### **Common Issues**

**CORS Errors**
- Ensure your CloudFront URL is in `CORS_ORIGINS`
- Check API Gateway CORS configuration

**Authentication Issues**
- Verify Cognito User Pool ID and Client ID match
- Ensure email verification is enabled in Cognito

**File Upload Issues**
- Check S3 bucket permissions
- Verify Lambda has S3 access

**Lambda Cold Starts**
- Consider using Provisioned Concurrency for production
- Optimize function memory allocation

### **Getting Help**
- Check CloudWatch Logs for detailed error messages
- Use API Gateway test functionality
- Enable debug logging in development

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- **FastAPI** - High-performance Python web framework
- **React** - Frontend JavaScript library
- **AWS** - Cloud infrastructure platform
- **Tailwind CSS** - Utility-first CSS framework

## 📞 **Support**

- 📖 **Documentation**: Check the docs in this repository
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Email**: Contact the maintainers

---

**Built with ❤️ using FastAPI, React, and AWS**