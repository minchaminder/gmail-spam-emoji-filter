# Gmail Spam Emoji Filter

This repository contains a Google Apps Script designed to filter and delete spam emails based on the presence of emojis in the sender's name or subject. The script can scan emails in the spam folder and either move them to trash or permanently delete them, depending on the function you choose to run.

![image](https://github.com/user-attachments/assets/4cc384ab-5eb4-4557-bc34-7e78075e5123)

### Changelog

#### v1.1.0
- **Feature**: Added logging functionality to Google Drive spreadsheet.
   - **Explanation**: The script can now log email processing actions (checking, moving to trash, preparing to delete) to a specified Google Sheet for better tracking and debugging.
   - **Instructions**:
      1. **Create a New Spreadsheet**: Create a new Google Spreadsheet and note the spreadsheet ID.
      2. **Set Variables**: In the script, set `logSpreadsheetId` to your spreadsheet ID and `logSheetName` to the desired sheet name.
      3. **Use `logMessage` Function**: The script will automatically log messages to the specified sheet.
     
## How to Use

### Step 1: Set Up Google Apps Script

1. **Open Google Apps Script**:
   - Go to [Google Apps Script](https://script.google.com/).
   - Create a new project.

2. **Copy the Script**:
   - Copy the content from the `Code.gs` file in this repository and paste it into the Google Apps Script editor.

3. **Save the Project**:
   - Save the project with a descriptive name.

### Step 2: Enable Gmail API

1. **Enable Advanced Services**:
   - In the Apps Script Editor, go to "Services" in the sidebar.
   - Enable the "Gmail API".

### Step 3: Configure the Script

1. **Set the Detection Scope**:
   - At the beginning of the script, find the line `var searchScope = "either";`.
   - Modify the value of `searchScope` based on where you want the script to look for emojis:
      - `"sender"`: Only checks the sender's name for emojis.
      - `"subject"`: Only checks the email subject for emojis.
      - `"both"`: Checks both the sender's name and email subject for emojis.
      - `"either"`: Checks either the sender's name or email subject for emojis.

### Step 4: Verify the Script

1. **Run the Test Function**:
   - Execute the `testExtractAndLogProcessedEmails` function to log the sender names and subjects containing emojis.
   - Check the logs to ensure the correct emails are identified.

### Step 5: Set Up Time-Driven Triggers

#### Option 1: Move Emails to Trash

1. **Create a Trigger**:
   - In the Apps Script editor, click on the clock icon in the left sidebar (Triggers).
   - Click on "Add Trigger" at the bottom right.

2. **Configure the Trigger**:
   - Choose which function to run: `processSpamEmails`.
   - Choose which deployment should run: Head.
   - Select event source: Time-driven.
   - Select type of time-based trigger: Choose the frequency that suits your needs (e.g., daily, hourly).
   - Select time of day (if applicable): Choose a time that works best for you.

3. **Save the Trigger**:
   - Click "Save" to create the trigger.

#### Option 2: Permanently Delete Emails

1. **Create a Trigger**:
   - In the Apps Script editor, click on the clock icon in the left sidebar (Triggers).
   - Click on "Add Trigger" at the bottom right.

2. **Configure the Trigger**:
   - Choose which function to run: `permanentlyDeleteProcessedEmails`.
   - Choose which deployment should run: Head.
   - Select event source: Time-driven.
   - Select type of time-based trigger: Choose the frequency that suits your needs (e.g., daily, hourly).
   - Select time of day (if applicable): Choose a time that works best for you.

3. **Save the Trigger**:
   - Click "Save" to create the trigger.

## Script Details

- `processSpamEmails`: Moves the matching emails to trash based on the specified scope.
- `permanentlyDeleteProcessedEmails`: Moves the matching emails to trash and then permanently deletes them by targeting their specific IDs using the Gmail API.
- `deleteEmailsInTrash`: Uses the Gmail API to permanently delete specific emails from the trash.
- `extractSenderName`: Extracts the sender name from raw email content.
- `containsEncodedEmoji`: Checks if the sender name contains any encoded emoji sequences.
- `containsEmoji`: Checks if the text contains any visible emojis.
- `testExtractAndLogProcessedEmails`: Logs sender names and subjects for verification.

