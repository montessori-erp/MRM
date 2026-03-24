// import cron from 'node-cron';
// import Inventory from '../models/Inventory.js';
// import User from '../models/User.js';
// import nodemailer from 'nodemailer';

// let transporter = null;
// function getTransporter() {
//   if (transporter) return transporter;
//   if (process.env.SMTP_HOST && process.env.SMTP_USER) {
//     transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT) || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
//   }
//   return transporter;
// }

// async function sendAlertEmails(items) {
//   const trans = getTransporter();
//   if (!trans) {
//     console.log('[Threshold Alert] No SMTP config; skipping email. Items below threshold:', items.length);
//     return;
//   }
//   const deptIds = [...new Set(items.map((i) => i.departmentId.toString()))];
//   const staffAndSuper = await User.find({
//     isActive: true,
//     $or: [
//       { departmentId: { $in: deptIds }, role: 'Staff' },
//       { role: 'Super-Admin' },
//     ],
//   }).select('email name');
//   const to = staffAndSuper.map((u) => u.email).filter(Boolean);
//   if (to.length === 0) return;
//   const list = items
//     .map((i) => `- ${i.itemName} (${i.departmentId?.name || i.departmentId}): ${i.currentQuantity} / ${i.thresholdLevel}`)
//     .join('\n');
//   try {
//     await trans.sendMail({
//       from: process.env.ALERT_EMAIL_FROM || process.env.SMTP_USER,
//       to,
//       subject: '[DREAM] Inventory threshold alert',
//       text: `The following items are below their threshold level:\n\n${list}`,
//       html: `<p>The following items are below their threshold level:</p><pre>${list}</pre>`,
//     });
//     console.log('[Threshold Alert] Emails sent to', to.length, 'recipients');
//   } catch (err) {
//     console.error('[Threshold Alert] Email error:', err.message);
//   }
// }

// export function runThresholdCheck() {
//   Inventory.find({
//     $expr: { $lt: ['$currentQuantity', '$thresholdLevel'] },
//   })
//     .populate('departmentId', 'name')
//     .lean()
//     .then(async (items) => {
//       if (items.length === 0) return;
//       console.log('[Threshold Alert]', items.length, 'items below threshold');
//       await sendAlertEmails(items);
//     })
//     .catch((err) => console.error('[Threshold Alert]', err));
// }

// export function startThresholdCron() {
//   runThresholdCheck();
//   cron.schedule('0 8 * * *', runThresholdCheck, { timezone: 'Asia/Kolkata' });
//   console.log('[Cron] Threshold alert job scheduled (daily 8:00 AM IST)');
// }




import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  // Fallback to Gmail App Password logic if SMTP_HOST is missing but EMAIL_USER exists
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host: host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user, pass },
    });
  }
  return transporter;
}

async function sendAlertEmails(items) {
  const trans = getTransporter();
  if (!trans) {
    console.log('[Threshold Alert] No SMTP config; skipping email. Items below threshold:', items.length);
    return;
  }

  // FIXED: Extracting the ID safely even if departmentId is an object (due to populate)
  const deptIds = [...new Set(items.map((i) => {
    return i.departmentId?._id ? i.departmentId._id.toString() : i.departmentId.toString();
  }))];

  const staffAndSuper = await User.find({
    isActive: true,
    $or: [
      { departmentId: { $in: deptIds }, role: 'Staff' },
      { role: 'Super-Admin' },
    ],
  }).select('email name');

  const to = staffAndSuper.map((u) => u.email).filter(Boolean);
  if (to.length === 0) return;

  const list = items
    .map((i) => {
      const deptName = i.departmentId?.name || 'General';
      return `- ${i.itemName} (${deptName}): ${i.currentQuantity} / ${i.thresholdLevel}`;
    })
    .join('\n');

  try {
    await trans.sendMail({
      from: process.env.ALERT_EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER,
      to,
      subject: '[DREAM] Inventory threshold alert',
      text: `The following items are below their threshold level:\n\n${list}`,
      html: `<p>The following items are below their threshold level:</p><pre>${list}</pre>`,
    });
    console.log('[Threshold Alert] Emails sent to', to.length, 'recipients');
  } catch (err) {
    console.error('[Threshold Alert] Email error:', err.message);
  }
}

export function runThresholdCheck() {
  // Use currentQuantity and thresholdLevel as per your schema
  Inventory.find({
    $expr: { $lte: ['$currentQuantity', '$thresholdLevel'] },
  })
    .populate('departmentId', 'name')
    .lean()
    .then(async (items) => {
      if (items.length === 0) return;
      console.log('[Threshold Alert]', items.length, 'items below threshold');
      await sendAlertEmails(items);
    })
    .catch((err) => console.error('[Threshold Alert] Query Error:', err));
}

export function startThresholdCron() {
  // Run once on startup
  runThresholdCheck();
  
  // Schedule for 8:00 AM IST daily
  cron.schedule('0 8 * * *', runThresholdCheck, { timezone: 'Asia/Kolkata' });
  console.log('[Cron] Threshold alert job scheduled (daily 8:00 AM IST)');
}