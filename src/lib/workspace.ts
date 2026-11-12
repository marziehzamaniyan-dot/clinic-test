import { getAccessToken } from './firebase';

/**
 * Google Calendar API helper: Insert an appointment event into user's Google Calendar
 */
export async function createGoogleCalendarEvent(eventData: {
  summary: string;
  description: string;
  location?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}) {
  const token = await getAccessToken();
  if (!token) throw new Error('برای اتصال به تقویم گوگل، ابتدا با حساب کاربری گوگل خود وارد شوید.');

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location || 'مازندران، ساری، بیمارستان امیر مازندرانی، ط ۳، مطب دکتر زمانیان',
      start: { dateTime: eventData.startTime, timeZone: 'Asia/Tehran' },
      end: { dateTime: eventData.endTime, timeZone: 'Asia/Tehran' },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'خطا در ثبت رویداد در تقویم گوگل');
  }

  return await res.json();
}

/**
 * Google Calendar API helper: List upcoming events from primary calendar
 */
export async function listGoogleCalendarEvents(maxResults = 10) {
  const token = await getAccessToken();
  if (!token) throw new Error('نیاز به احراز هویت با گوگل');

  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    now
  )}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'خطا در دریافت رویدادهای تقویم');
  }

  return await res.json();
}

/**
 * Gmail API helper: Send an email directly via Gmail
 */
export async function sendGmailMessage(options: {
  to: string;
  subject: string;
  bodyText: string;
}) {
  const token = await getAccessToken();
  if (!token) throw new Error('برای ارسال ایمیل، احراز هویت با حساب جیمیل الزامی است.');

  // UTF-8 base64 encoded RFC 2822 email format
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(options.subject)))}?=`;
  const emailLines = [
    `To: ${options.to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    options.bodyText,
  ];
  const email = emailLines.join('\r\n');
  const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64EncodedEmail }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'خطا در ارسال ایمیل از طریق جیمیل');
  }

  return await res.json();
}

/**
 * Google Drive API helper: List files in user's Drive
 */
export async function listGoogleDriveFiles(pageSize = 15) {
  const token = await getAccessToken();
  if (!token) throw new Error('نیاز به اتصال به گوگل درایو');

  const query = encodeURIComponent("trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,thumbnailLink,createdTime)&q=${query}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'خطا در بارگذاری پرونده‌ها از گوگل درایو');
  }

  return await res.json();
}

/**
 * Google Docs API helper: Create a new medical record / consent document in Google Docs
 */
export async function createGoogleDocDocument(title: string, initialContent: string) {
  const token = await getAccessToken();
  if (!token) throw new Error('نیاز به اتصال به گوگل داکس');

  // Step 1: Create the empty document via Docs API
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'خطا در ایجاد سند در گوگل داکس');
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  // Step 2: Insert text into the newly created document
  if (initialContent && documentId) {
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: initialContent,
            },
          },
        ],
      }),
    });
  }

  return doc;
}

/**
 * Google Classroom API helper: List courses
 */
export async function listGoogleClassroomCourses() {
  const token = await getAccessToken();
  if (!token) throw new Error('نیاز به اتصال به گوگل کلاس‌روم');

  const res = await fetch('https://classroom.googleapis.com/v1/courses?pageSize=10', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'خطا در دسترسی به دوره‌های آموزشی گوگل کلاس‌روم');
  }

  return await res.json();
}
