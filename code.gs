// Define where to look for emojis: "sender", "subject", "both", or "either"
var searchScope = "either";
// Flag to enable or disable logging
var enableLogging = true;
var logSpreadsheetId = "YOUR_SPREADSHEET_ID"; // Replace with your spreadsheet ID
var logSheetName = "Logs"; // Name of the sheet where logs will be written

function processSpamEmails() {
  var spamThreads = GmailApp.getSpamThreads();

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      var subject = messages[j].getSubject();
      var shouldProcess = false;

      logMessage("Checking email from: " + senderName + " with subject: " + subject);

      if (searchScope === "sender" && containsEmoji(senderName)) {
        shouldProcess = true;
      } else if (searchScope === "subject" && containsEmoji(subject)) {
        shouldProcess = true;
      } else if (searchScope === "both" && containsEmoji(senderName) && containsEmoji(subject)) {
        shouldProcess = true;
      } else if (searchScope === "either" && (containsEmoji(senderName) || containsEmoji(subject))) {
        shouldProcess = true;
      }

      if (shouldProcess) {
        logMessage("Moving to trash: " + senderName + " - " + subject);
        messages[j].moveToTrash();
      }
    }
  }
}

function permanentlyDeleteProcessedEmails() {
  var spamThreads = GmailApp.getSpamThreads();
  var emailsToDelete = [];

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      var subject = messages[j].getSubject();
      var shouldDelete = false;

      logMessage("Checking email from: " + senderName + " with subject: " + subject);

      if (searchScope === "sender" && containsEmoji(senderName)) {
        shouldDelete = true;
      } else if (searchScope === "subject" && containsEmoji(subject)) {
        shouldDelete = true;
      } else if (searchScope === "both" && containsEmoji(senderName) && containsEmoji(subject)) {
        shouldDelete = true;
      } else if (searchScope === "either" && (containsEmoji(senderName) || containsEmoji(subject))) {
        shouldDelete = true;
      }

      if (shouldDelete) {
        logMessage("Preparing to delete: " + senderName + " - " + subject);
        messages[j].moveToTrash();
        emailsToDelete.push(messages[j].getId());
      }
    }
  }

  logMessage("Emails to delete: " + emailsToDelete.length);
  if (emailsToDelete.length > 0) {
    deleteEmailsInTrash(emailsToDelete);
  } else {
    logMessage("No emails to delete.");
  }
}

function deleteEmailsInTrash(emailIds) {
  if (!emailIds || emailIds.length === 0) {
    logMessage("No email IDs provided for deletion.");
    return;
  }

  const baseUrl = 'https://www.googleapis.com/gmail/v1/users/me/messages/';
  const accessToken = ScriptApp.getOAuthToken();

  emailIds.forEach(emailId => {
    const url = baseUrl + emailId;
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      muteHttpExceptions: true
    };
    try {
      const response = UrlFetchApp.fetch(url, options);
      logMessage(`Deleted email ID: ${emailId}, response: ${response.getContentText()}`);
    } catch (e) {
      logMessage(`Failed to delete email ID: ${emailId}, error: ${e.message}`);
    }
  });
}

function extractSenderName(rawContent) {
  if (!rawContent) {
    return 'Unknown';
  }
  var senderMatch = rawContent.match(/From: (.*?)(\r?\n|$)/);
  return senderMatch ? senderMatch[1].trim() : 'Unknown';
}

function containsEmoji(text) {
  if (!text) {
    return false;
  }
  const encodedEmojiRegex = /=\?utf-8\?(Q|B)\?.*?=/i;
  const visibleEmojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return encodedEmojiRegex.test(text) || visibleEmojiRegex.test(text);
}



function testExtractAndLogProcessedEmails() {
  var spamThreads = GmailApp.getSpamThreads();

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var senderName = extractSenderName(rawContent);
      var subject = messages[j].getSubject();
      var shouldLog = false;

      logMessage("Checking email from: " + senderName + " with subject: " + subject);

      if (searchScope === "sender" && containsEmoji(senderName)) {
        shouldLog = true;
      } else if (searchScope === "subject" && containsEmoji(subject)) {
        shouldLog = true;
      } else if (searchScope === "both" && containsEmoji(senderName) && containsEmoji(subject)) {
        shouldLog = true;
      } else if (searchScope === "either" && (containsEmoji(senderName) || containsEmoji(subject))) {
        shouldLog = true;
      }

      if (shouldLog) {
        logMessage("Found encoded emoji: " + senderName + " - " + subject);
      }
    }
  }
}

function logMessage(message) {
  if (enableLogging) {
    var spreadsheet = SpreadsheetApp.openById(logSpreadsheetId);
    var sheet = spreadsheet.getSheetByName(logSheetName) || spreadsheet.insertSheet(logSheetName);
    sheet.appendRow([new Date(), message]);
  }
}

function logRawSubjectsInSpam() {
  var spamThreads = GmailApp.getSpamThreads();

  for (var i = 0; i < spamThreads.length; i++) {
    var messages = spamThreads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var rawContent = messages[j].getRawContent();
      var subjectMatch = rawContent.match(/Subject: (.*?)(\r?\n|$)/);
      var subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject';

      var senderMatch = rawContent.match(/From: (.*?)(\r?\n|$)/);
      var senderName = senderMatch ? senderMatch[1].trim() : 'Unknown';

      Logger.log("Raw Subject: " + subject + ", Raw Sender: " + senderName);
    }
  }
}
