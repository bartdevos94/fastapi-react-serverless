# 🚀 Deployment Guide - AWS Console Manual Setup

This guide walks you through deploying the FastAPI React application using **only the AWS Console web interface**. No CLI tools required!

## 🎯 **Overview**

You'll create these AWS resources manually:
- **S3 Buckets** (file storage and website hosting)
- **Cognito User Pool** (authentication)
- **DynamoDB Table** (user data storage)
- **Lambda Function** (FastAPI backend)
- **API Gateway** (API endpoints)
- **CloudFront Distribution** (global CDN)

**Estimated time**: 45-60 minutes for first deployment

## 📋 **Prerequisites**

- ✅ **AWS Account** with admin access
- ✅ **Code Editor** (VS Code, etc.)
- ✅ **Node.js 18+** (for building frontend)
- ✅ **Python 3.11+** (for testing locally)

## 📝 **Important: Keep Track of Values**

As you create resources, **write down these values** - you'll need them later:

```
📝 Deployment Tracking Sheet
===========================
[ ] Deployment S3 Bucket: ____________________
[ ] Frontend S3 Bucket: _______________________
[ ] Cognito User Pool ID: _____________________
[ ] Cognito Client ID: ________________________
[ ] API Gateway URL: __________________________
[ ] CloudFront URL: ___________________________
```

---

## 🪣 **Step 1: Create S3 Buckets**

### **1.1 Create Deployment Bucket**

1. **Open S3 Console**: https://console.aws.amazon.com/s3/
2. **Click "Create bucket"**
3. **Configure**:
   - **Bucket name**: `my-app-deployment-12345` (must be globally unique)
   - **Region**: `us-east-1` (or your preferred region)
   - **Keep all other defaults**
4. **Click "Create bucket"**

📝 **Write down**: Deployment bucket name

### **1.2 Create Frontend Hosting Bucket**

1. **Click "Create bucket"** again
2. **Configure**:
   - **Bucket name**: `my-app-frontend-12345` (must be globally unique)
   - **Same region** as deployment bucket
   - **❗ Uncheck "Block all public access"**
   - **✅ Check the acknowledgment** about public access
3. **Click "Create bucket"**

📝 **Write down**: Frontend bucket name

### **1.3 Enable Website Hosting**

1. **Click on your frontend bucket**
2. **Go to "Properties" tab**
3. **Scroll to "Static website hosting"**
4. **Click "Edit"**
5. **Configure**:
   - **✅ Enable** static website hosting
   - **Index document**: `index.html`
   - **Error document**: `index.html`
6. **Save changes**

### **1.4 Set Bucket Policy for Public Access**

1. **Go to "Permissions" tab**
2. **Click "Bucket policy"**
3. **Paste this policy** (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

4. **Save changes**

✅ **Verification**: You should see "Publicly accessible" under bucket overview

---

## 👤 **Step 2: Create Cognito User Pool**

### **2.1 Create User Pool**

1. **Open Cognito Console**: https://console.aws.amazon.com/cognito/
2. **Click "Create user pool"**

### **2.2 Configure Sign-in Experience**
- **Authentication providers**: Cognito user pool
- **Cognito user pool sign-in options**: ✅ **Email**
- **Click "Next"**

### **2.3 Configure Security Requirements**
- **Password policy**: Cognito defaults
- **Multi-factor authentication**: No MFA
- **User account recovery**: ✅ **Enable self-service account recovery**
- **Click "Next"**

### **2.4 Configure Sign-up Experience**
- **Self-service sign-up**: ✅ **Enable**
- **Attribute verification and user account confirmation**:
  - ✅ **Send email message, verify email address**
- **Required attributes**: ✅ **email**, ✅ **name**
- **Click "Next"**

### **2.5 Configure Message Delivery**
- **Email provider**: Send email with Cognito
- **Click "Next"**

### **2.6 Integrate Your App**
- **User pool name**: `my-app-users`
- **App client name**: `my-app-client`
- **Client secret**: ❌ **Don't generate a client secret**
- **Click "Next"**

### **2.7 Review and Create**
- **Review all settings**
- **Click "Create user pool"**

### **2.8 Get Important Values**

After creation:
1. **Copy the User Pool ID** (format: `us-east-1_XXXXXXXXX`)
2. **Go to "App integration" tab**
3. **Click on your app client**
4. **Copy the Client ID** (long alphanumeric string)

📝 **Write down**: 
- Cognito User Pool ID
- Cognito Client ID

---

## 🗄️ **Step 3: Create DynamoDB Table**

1. **Open DynamoDB Console**: https://console.aws.amazon.com/dynamodb/
2. **Click "Create table"**
3. **Configure**:
   - **Table name**: `my-app-users`
   - **Partition key**: `user_id` (String)
   - **Keep all other defaults**
4. **Click "Create table"**

✅ **Verification**: Table should show "Active" status after a few minutes

---

## ⚡ **Step 4: Create Lambda Function**

### **4.1 Prepare Your Code**

1. **Open your project** in a code editor
2. **Navigate to** `fastapi-aws-backend/`
3. **Create a ZIP file** containing:
   - The entire `app/` folder
   - `requirements.txt` file
4. **Name the ZIP**: `backend-code.zip`

### **4.2 Create Lambda Function**

1. **Open Lambda Console**: https://console.aws.amazon.com/lambda/
2. **Click "Create function"**
3. **Configure**:
   - **Author from scratch**
   - **Function name**: `my-app-backend`
   - **Runtime**: Python 3.11
   - **Architecture**: x86_64
4. **Click "Create function"**

### **4.3 Upload Your Code**

1. **In the function page, scroll to "Code source"**
2. **Click "Upload from" → ".zip file"**
3. **Upload your `backend-code.zip`**
4. **Click "Save"**

### **4.4 Configure Environment Variables**

1. **Go to "Configuration" tab**
2. **Click "Environment variables"**
3. **Click "Edit"**
4. **Add these variables**:
   ```
   AWS_REGION = us-east-1
   COGNITO_USER_POOL_ID = [your-user-pool-id-from-step-2]
   COGNITO_CLIENT_ID = [your-client-id-from-step-2]
   DYNAMODB_TABLE_NAME = my-app-users
   ENVIRONMENT = dev
   CORS_ORIGINS = http://localhost:3000
   ```
5. **Click "Save"**

### **4.5 Configure Runtime Settings**

1. **Go to "Runtime settings"**
2. **Click "Edit"**
3. **Configure**:
   - **Handler**: `app.main.handler`
   - **Timeout**: 30 seconds
4. **Click "Save"**
### **4.6 Create IAM User and Attach Permissions**

1. **Open the IAM Console**: https://console.aws.amazon.com/iam/
2. **Go to "Users" → "Add users"**
3. **Set user name**: e.g., `my-app-backend-user`
4. **Select "Provide user access to the AWS Management Console"** (optional, for programmatic access only, skip console access)
5. **On "Set permissions" step, choose "Attach policies directly"**
6. **Click "Create policy"** and use the following JSON (adjust resources for stricter security):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AppAccess",
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "dynamodb:BatchGetItem",
           "dynamodb:PutItem",
           "dynamodb:DeleteItem",
           "dynamodb:GetItem",
           "dynamodb:Query",
           "dynamodb:UpdateItem"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

   > 💡 **Tip:** For stricter security, specify only the S3 buckets and DynamoDB tables created for this app instead of `"Resource": "*"`.

7. **Name the policy**: e.g., `fastapi-app-policy`, then **create the policy**
8. **Back in the user creation tab, attach your new policy** to the user
9. **Complete user creation**
10. **Select the new user → "Security credentials" → "Create access key"**
    - **Use "Other" as the use case**
    - **Download or copy the Access Key ID and Secret Access Key** (you won't be able to see the secret again)
11. **Store these keys securely** (e.g., in your `.env` file or GitHub secrets)

---




### **4.6 Update IAM Permissions**

1. **Go to "Configuration" → "Permissions"**
2. **Click on the execution role name** (opens IAM)
3. **Click "Attach policies"**
4. **Add these policies**:
   - `AmazonDynamoDBFullAccess`
   - `AmazonCognitoPowerUser`
   - `AmazonS3FullAccess`
5. **Click "Attach policies"**
 

✅ **Verification**: Test your function with a simple test event

---

## 🌐 **Step 5: Create API Gateway**

### **5.1 Create HTTP API**

1. **Open API Gateway Console**: https://console.aws.amazon.com/apigateway/
2. **Click "Create API"**
3. **Choose "HTTP API"** → **Build**

### **5.2 Configure Integration**

1. **Add integration**:
   - **Integration type**: Lambda
   - **Lambda function**: `my-app-backend`
   - **Version**: 2.0
2. **Click "Next"**

### **5.3 Configure Routes**

1. **Configure routes**:
   - **Method**: ANY
   - **Resource path**: `/{proxy+}`
   - **Integration target**: `my-app-backend`
2. **Click "Next"**

### **5.4 Define Stage**

1. **Stage name**: `dev`
2. **Click "Next"**

### **5.5 Review and Create**

1. **Review configuration**
2. **Click "Create"**

### **5.6 Enable CORS**

1. **Go to your API**
2. **Click "CORS"**
3. **Configure CORS**:
   - **Access-Control-Allow-Origin**: `*` (or your specific domains)
   - **Access-Control-Allow-Headers**: `*`
   - **Access-Control-Allow-Methods**: `*`
4. **Save**

### **5.7 Get API URL**

📝 **Write down**: Copy the "Invoke URL" (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/dev`)

---

## 🌍 **Step 6: Create CloudFront Distribution**

### **6.1 Create Distribution**

1. **Open CloudFront Console**: https://console.aws.amazon.com/cloudfront/
2. **Click "Create distribution"**

### **6.2 Configure Origin**

1. **Origin settings**:
   - **Origin domain**: Select your frontend S3 bucket from dropdown
   - **Origin access**: Origin access control settings (recommended)
   - **Create new OAC** if prompted and save

### **6.3 Configure Default Cache Behavior**

1. **Default cache behavior**:
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - **Cache policy**: CachingOptimized

### **6.4 Configure Settings**

1. **Settings**:
   - **Default root object**: `index.html`
   - **Standard logging**: Off (for now)

### **6.5 Create Distribution**

1. **Click "Create distribution"**
2. **Wait for deployment** (takes 10-15 minutes)

### **6.6 Update S3 Bucket Policy**

After CloudFront creates the OAC:
1. **Go back to your S3 bucket**
2. **CloudFront will show a banner to update bucket policy**
3. **Click "Copy policy"** and update your bucket policy

### **6.7 Get CloudFront URL**

📝 **Write down**: Copy the "Distribution domain name" (e.g., `d1234567890.cloudfront.net`)

---

## 📝 **Step 7: Configure Environment Files**

### **7.1 Update Backend Environment**

Edit `fastapi-aws-backend/.env`:
```env
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
DYNAMODB_TABLE_NAME=my-app-users
ENVIRONMENT=dev
CORS_ORIGINS=https://d1234567890.cloudfront.net,http://localhost:3000
```

### **7.2 Update Frontend Environment**

Edit `react-aws-frontend/.env`:
```env
VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **7.3 Update Lambda Environment Variables**

1. **Go back to Lambda Console**
2. **Update CORS_ORIGINS** to include your CloudFront URL:
   ```
   CORS_ORIGINS = https://d1234567890.cloudfront.net,http://localhost:3000
   ```

---

## 🚀 **Step 8: Build and Deploy Frontend**

### **8.1 Build Frontend**

```bash
cd react-aws-frontend
npm install
npm run build
```

### **8.2 Upload to S3**

1. **Go to your frontend S3 bucket**
2. **Click "Upload"**
3. **Drag all files and folders** from the `dist/` directory
4. **Click "Upload"**

✅ **Verification**: Check that files are uploaded successfully

---

## ✅ **Step 9: Test Your Application**

### **9.1 Test Backend API**

1. **Visit**: `https://your-api-gateway-url/docs`
2. **Should see**: FastAPI documentation
3. **Test**: `/health` endpoint

### **9.2 Test Frontend**

1. **Visit**: `https://your-cloudfront-url`
2. **Should see**: React application
3. **Test**: Navigation and UI components

### **9.3 Test Authentication**

1. **Try signing up** with a real email address
2. **Check email** for verification code
3. **Verify account** and log in
4. **Test protected features**

---

## 🐛 **Troubleshooting**

### **Common Issues**

**Lambda function not working?**
- Check CloudWatch Logs in Lambda console
- Verify all environment variables are set
- Test function with a simple test event

**CORS errors in browser?**
- Ensure CloudFront URL is in Lambda CORS_ORIGINS
- Check API Gateway CORS configuration
- Clear browser cache

**Authentication not working?**
- Verify Cognito IDs match in both backend and frontend
- Check Cognito User Pool settings
- Test with a fresh incognito/private browser window

**Frontend not loading?**
- Check S3 bucket policy allows public read
- Verify CloudFront distribution is deployed
- Check browser developer console for errors

**API Gateway errors?**
- Check Lambda function logs
- Verify Lambda permissions for DynamoDB and Cognito
- Test API Gateway integration

### **Debugging Tips**

1. **Use CloudWatch Logs** for detailed error messages
2. **Test each component individually** before testing together
3. **Check AWS service health** in your region
4. **Use browser developer tools** to inspect network requests
5. **Try different browsers** to rule out browser-specific issues

---

## 🎉 **Success! You're Done!**

Your application is now fully deployed on AWS:

- ✅ **Frontend**: `https://your-cloudfront-url`
- ✅ **Backend API**: `https://your-api-gateway-url`
- ✅ **API Docs**: `https://your-api-gateway-url/docs`

### **Next Steps**

1. **Set up custom domain** (optional)
2. **Configure monitoring** with CloudWatch
3. **Set up CI/CD** with GitHub Actions
4. **Optimize performance** and costs
5. **Add more features** to your application

### **Cost Optimization**

- Most services used are in AWS Free Tier
- Monitor costs in AWS Billing Console
- Consider Reserved Instances for production workloads

---

**Congratulations! 🎊 You've successfully deployed a full-stack application to AWS!**