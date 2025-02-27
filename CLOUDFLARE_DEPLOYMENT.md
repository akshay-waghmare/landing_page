# Deploying to Cloudflare Pages

This document provides instructions for deploying this React application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Git repository with your code
- Node.js and npm installed locally

## Setup Steps

### 1. Install Wrangler CLI

If you haven't already, install Wrangler CLI globally:

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

Authenticate with your Cloudflare account:

```bash
wrangler login
```

### 3. Build and Deploy Locally

You can build and deploy the application using the following command:

```bash
npm run deploy
```

This will build the application and deploy it to Cloudflare Pages.

### 4. Deploy via Cloudflare Dashboard

Alternatively, you can set up continuous deployment through the Cloudflare Dashboard:

1. Go to the Cloudflare Dashboard
2. Navigate to Pages
3. Click "Create a project"
4. Connect your Git repository
5. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `build`
6. Add environment variables:
   - `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key
   - `REACT_APP_MOCK_API`: Set to "true" or "false" depending on whether you want to use mock API responses
   - `REACT_APP_API_URL`: Your API endpoint URL

## Environment Variables

The application uses the following environment variables:

- `REACT_APP_OPENAI_API_KEY`: Your OpenAI API key for RAG functionality
- `REACT_APP_MOCK_API`: Set to "true" to use mock API responses, "false" to use real API
- `REACT_APP_API_URL`: The base URL for your API

You can set these in the Cloudflare Pages dashboard under Settings > Environment variables.

## Custom Domains

To set up a custom domain:

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to add your domain

## Troubleshooting 404 Errors

If you encounter 404 errors on your Cloudflare Pages deployment:

1. **Check your routing files**:
   - Ensure `_redirects` file contains: `/*    /index.html   200`
   - Ensure `_routes.json` is properly configured
   - Make sure `404.html` is set up to redirect to the main application

2. **Verify build settings**:
   - The build command should include copying the routing files: 
     `react-scripts build && cp public/_redirects build/ && cp public/_headers build/ && cp public/_routes.json build/`

3. **Check wrangler.toml configuration**:
   - Make sure it has the correct structure:
     ```toml
     [build]
     command = "npm run build"
     
     [site]
     bucket = "build"
     ```

4. **Verify SPA routing script**:
   - Ensure the SPA routing script is included in your `index.html`

5. **Clear cache**:
   - Try clearing your browser cache or using incognito mode
   - You can also purge the Cloudflare cache from the dashboard

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [React Router with Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-application/)
- [Environment Variables in Cloudflare Pages](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Handling 404s in SPAs](https://developers.cloudflare.com/pages/platform/serving-pages/#single-page-application-spa-routing) 