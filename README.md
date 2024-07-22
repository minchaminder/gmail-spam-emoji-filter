# Gmail Spam Emoji Filter

This repository contains a Google Apps Script designed to filter and delete spam emails based on the presence of encoded emojis in the sender's name. The script scans emails in the spam folder and either moves them to trash or permanently deletes them, depending on the function you choose to run.

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

### Step 3: Verify the Script

1. **Run the Test Function**:
   - Execute the `testExtractAndLogSenderNamesWithEncodedEmojis` function to log the sender names containing encoded emojis.
   - Check the logs to ensure the correct emails are identified.

### Step 4: Set Up Time-Driven Triggers

#### Option 1: Move Emails to Trash

1. **Create a Trigger**:
   - In the Apps Script editor, click on the clock icon in the left sidebar (Triggers).
   - Click on "Add Trigger" at the bottom right.

2. **Configure the Trigger**:
   - Choose which function to run: `moveToTrashSpamEmailsWithEncodedEmojisInSender`.
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
   - Choose which function to run: `permanentlyDeleteSpamEmailsWithEncodedEmojisInSender`.
   - Choose which deployment should run: Head.
   - Select event source: Time-driven.
   - Select type of time-based trigger: Choose the frequency that suits your needs (e.g., daily, hourly).
   - Select time of day (if applicable): Choose a time that works best for you.

3. **Save the Trigger**:
   - Click "Save" to create the trigger.

## Script Details

- `moveToTrashSpamEmailsWithEncodedEmojisInSender`: Moves the matching emails to trash.
- `permanentlyDeleteSpamEmailsWithEncodedEmojisInSender`: Moves the matching emails to trash and then permanently deletes them by targeting their specific IDs using the Gmail API.
- `deleteEmailsInTrash`: Uses the Gmail API to permanently delete specific emails from the trash.
- `extractSenderName`: Extracts the sender name from raw email content.
- `containsEncodedEmoji`: Checks if the sender name contains any encoded emoji sequences.
- `testExtractAndLogSenderNamesWithEncodedEmojis`: Logs sender names for verification.