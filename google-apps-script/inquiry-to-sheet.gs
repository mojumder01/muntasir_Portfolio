// =============================================================
// inquiry-to-sheet.gs  (Google Apps Script — runs on Google, free)
// Receives project inquiries and price offers from the website and
// saves each one as a new row in YOUR private Google Sheet.
// Optional: emails you and/or sends a Telegram message for each one.
//
// Setup (5 minutes) — full steps in README.md, section "Google Sheet":
//   1. Open your Google Sheet → Extensions → Apps Script
//   2. Paste this whole file, Save
//   3. Deploy → New deployment → Web app
//        Execute as: Me   |   Who has access: Anyone
//   4. Copy the Web app URL (ends with /exec) into the admin:
//        Site settings → Integrations → Google Sheet web app URL
//
// Optional settings (Project Settings → Script properties) — secrets
// stay here on Google's side, never in the website code:
//   NOTIFY_EMAIL         your email for a notification per message
//   TELEGRAM_BOT_TOKEN   token from @BotFather
//   TELEGRAM_CHAT_ID     your chat id (send /start to your bot first)
// =============================================================

/* ---------- 1. Settings ---------- */
var MAX_REQUESTS_PER_MINUTE = 20; // simple flood protection for the whole form
var MAX_FIELD_LENGTH = 2000; // longer values are cut
var LOCK_WAIT_MS = 10000; // wait up to 10 s if two messages arrive at once

// One tab per message type, with the columns in order.
// Each column: [header shown in the sheet, field name sent by the website]
var SHEETS = {
  inquiry: {
    tabName: 'Inquiries',
    columns: [
      ['Received at', '_receivedAt'],
      ['Service', 'service'],
      ['Plan', 'plan'],
      ['Budget', 'budget'],
      ['Timeline', 'timeline'],
      ['Project details', 'details'],
      ['Name', 'name'],
      ['Email', 'email'],
      ['Company', 'company'],
      ['Status', '_status'],
    ],
  },
  offer: {
    tabName: 'Offers',
    columns: [
      ['Received at', '_receivedAt'],
      ['Offer for', 'offerFor'],
      ['Bid amount', 'bidAmount'],
      ['Currency', 'currency'],
      ['Name', 'name'],
      ['Phone', 'phone'],
      ['Email', 'email'],
      ['Address', 'address'],
      ['Note', 'note'],
      ['Status', '_status'],
    ],
  },
};

/* ---------- 2. Entry points ---------- */

/** Website sends messages here (POST). Always answers with JSON { ok: true|false }. */
function doPost(event) {
  try {
    var payload = parsePayload(event);
    if (!payload) return jsonResponse({ ok: false, error: 'bad-request' });

    // Spam trap filled → pretend success so bots learn nothing, but save nothing
    if (payload.honeypot) return jsonResponse({ ok: true });

    if (isRateLimited()) return jsonResponse({ ok: false, error: 'too-many-requests' });

    var sheetConfig = SHEETS[payload.kind];
    if (!sheetConfig) return jsonResponse({ ok: false, error: 'unknown-kind' });

    var row = buildRow(sheetConfig.columns, payload.fields);
    appendRowSafely(sheetConfig, row);
    notifyOwner(payload.kind, sheetConfig.columns, row);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('doPost failed: ' + error); // visible in Apps Script → Executions
    return jsonResponse({ ok: false, error: 'server-error' });
  }
}

/** Opening the URL in a browser just confirms it is running. */
function doGet() {
  return jsonResponse({ ok: true, message: 'Inquiry endpoint is running.' });
}

/* ---------- 3. Helpers ---------- */

/** Reads the JSON body. Returns null when it isn't the shape we expect. */
function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) return null;
  var data = JSON.parse(event.postData.contents);
  if (!data || typeof data.kind !== 'string' || typeof data.fields !== 'object' || data.fields === null) return null;
  return { kind: data.kind, fields: data.fields, honeypot: String(data.honeypot || '').trim() };
}

/** Allows at most MAX_REQUESTS_PER_MINUTE messages per minute in total. */
function isRateLimited() {
  var cache = CacheService.getScriptCache();
  var minuteKey = 'requests-' + Math.floor(Date.now() / 60000);
  var count = Number(cache.get(minuteKey) || 0) + 1;
  cache.put(minuteKey, String(count), 120);
  return count > MAX_REQUESTS_PER_MINUTE;
}

/**
 * Makes a value safe to put in a cell:
 * - text only, trimmed and length-limited
 * - values starting with = + - @ get a leading ' so the sheet never runs them
 *   as a formula (protects against "formula injection")
 */
function toSafeCell(value) {
  var text = String(value === undefined || value === null ? '' : value).trim().slice(0, MAX_FIELD_LENGTH);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

/** Builds one row in column order, using only the fields we expect. */
function buildRow(columns, fields) {
  return columns.map(function (column) {
    var fieldName = column[1];
    if (fieldName === '_receivedAt') return new Date();
    if (fieldName === '_status') return 'New';
    return toSafeCell(fields[fieldName]);
  });
}

/** Adds the row; creates the tab + bold header row the first time. */
function appendRowSafely(sheetConfig, row) {
  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_WAIT_MS);
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetConfig.tabName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetConfig.tabName);
      var headers = sheetConfig.columns.map(function (column) { return column[0]; });
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

/** Optional email / Telegram notification (only if set in Script properties). */
function notifyOwner(kind, columns, row) {
  var properties = PropertiesService.getScriptProperties();
  var title = kind === 'offer' ? 'New price offer' : 'New project inquiry';
  var lines = columns
    .map(function (column, index) { return column[0] + ': ' + row[index]; })
    .filter(function (line) { return !/^Status:/.test(line); });
  var messageText = title + '\n\n' + lines.join('\n');

  var notifyEmail = properties.getProperty('NOTIFY_EMAIL');
  if (notifyEmail) {
    try {
      MailApp.sendEmail(notifyEmail, title + ' — website', messageText);
    } catch (error) {
      console.error('Email notification failed: ' + error);
    }
  }

  var botToken = properties.getProperty('TELEGRAM_BOT_TOKEN');
  var chatId = properties.getProperty('TELEGRAM_CHAT_ID');
  if (botToken && chatId) {
    try {
      UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: chatId, text: messageText.slice(0, 4000) }),
        muteHttpExceptions: true,
      });
    } catch (error) {
      console.error('Telegram notification failed: ' + error);
    }
  }
}

/** JSON reply the website can read. */
function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
