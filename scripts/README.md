# Setting Up Google Sheets Integration

Follow these steps to set up Google Sheets as your form submission backend:

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "Website Form Submissions"
3. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```

## 2. Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Copy the contents of `google-apps-script.js` into the script editor
3. Replace `YOUR_SHEET_ID_HERE` with your actual Google Sheet ID
4. Save the project (give it a name like "Form Submission Handler")

## 3. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Choose **Web app** as the deployment type
3. Configure the following:
   - Description: "Form Submission Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click **Deploy**
5. Authorize the application when prompted
6. Copy the Web App URL provided (looks like `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`)

## 4. Configure Your Website

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the Google Apps Script URL:
   ```
   REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
3. If deploying to production, add this environment variable to your hosting platform

## 5. Test the Integration

1. Submit a test form on your website
2. Check your Google Sheet for the submission
3. Monitor the browser console for any errors

## Troubleshooting

### CORS Issues
- Run the `setupCORS` function in the Apps Script editor
- Make sure your deployment settings allow access from your website's domain

### Form Not Submitting
- Verify the Google Apps Script URL is correct
- Check the browser console for error messages
- Ensure all required form fields are filled out

### Data Not Appearing in Sheet
- Confirm the Sheet ID is correct
- Check the Apps Script execution logs for errors
- Verify the form data format matches the expected format 