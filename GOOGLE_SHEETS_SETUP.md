# Setting Up Google Sheets as a Form Submission Backend

This guide will walk you through setting up a Google Sheet to store form submissions from your website.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename the spreadsheet to something like "Website Form Submissions"
3. Note the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`

## Step 2: Create a Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. This will open the Apps Script editor in a new tab
3. Replace the default code with the contents of the `google-apps-script.js` file from this repository
4. Update the `SHEET_ID` constant with your actual Google Sheet ID
5. Click **Save** and name your project (e.g., "Form Submission Handler")

## Step 3: Deploy the Google Apps Script as a Web App

1. Click on **Deploy** > **New deployment**
2. For "Select type", choose **Web app**
3. Fill in the following settings:
   - Description: "Form Submission Handler"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (this allows your website to send data to the script)
4. Click **Deploy**
5. Copy the Web app URL that appears (it will look like `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec`)

## Step 4: Update Your Website Configuration

1. Add the Google Apps Script URL to your environment variables:
   - For local development, add to your `.env` file:
     ```
     REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec
     ```
   - For production, add to your hosting environment (e.g., Cloudflare Pages environment variables)

## Step 5: Test the Integration

1. Submit a test form on your website
2. Check your Google Sheet to verify that the submission was recorded
3. If you encounter any issues, check the browser console for error messages

## Troubleshooting

### CORS Issues

If you encounter CORS errors, you may need to:

1. In the Apps Script editor, run the `setupCORS` function manually
2. Make sure your script is deployed as a web app with "Anyone" access
3. Try adding your website's domain to the allowed origins in the Apps Script

### Form Data Not Appearing

1. Check that the form field names match the expected parameter names in the Apps Script
2. Verify that the Google Sheet ID is correct
3. Check the execution logs in the Apps Script editor for any errors

## Security Considerations

- This implementation is suitable for non-sensitive form data
- For sensitive information, consider additional security measures
- The Google Sheet will be accessible to anyone with the sheet URL, so don't share it publicly  