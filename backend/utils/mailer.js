const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

if (env.SMTP.host && env.SMTP.user && env.SMTP.pass) {
  transporter = nodemailer.createTransport({
    host: env.SMTP.host,
    port: env.SMTP.port,
    secure: env.SMTP.secure,
    auth: {
      user: env.SMTP.user,
      pass: env.SMTP.pass,
    },
  });
}

/**
 * Kirim email verifikasi akun
 */
async function sendVerificationEmail(toEmail, name, rawToken) {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email.html?token=${rawToken}`;

  const subject = 'Verifikasi Alamat Email Anda';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Halo, ${name}!</h2>
      <p style="color: #334155; font-size: 16px;">Terima kasih telah mendaftar. Silakan klik tombol di bawah untuk memverifikasi alamat email akun Anda:</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verifikasi Email Sekarang</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Atau salin tautan berikut ke browser Anda:</p>
      <p style="word-break: break-all; color: #2563eb; font-size: 13px;">${verifyUrl}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Tautan ini berlaku selama 24 jam. Jika Anda tidak pernah mendaftar, abaikan email ini.</p>
    </div>
  `;

  await sendMailWrapper(toEmail, subject, html, 'VERIFIKASI EMAIL', verifyUrl, rawToken);
}

/**
 * Kirim email reset password
 */
async function sendPasswordResetEmail(toEmail, name, rawToken) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password.html?token=${rawToken}`;

  const subject = 'Permintaan Reset Password Akun';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Halo, ${name}!</h2>
      <p style="color: #334155; font-size: 16px;">Kami menerima permintaan untuk mereset password akun Anda. Klik tombol berikut untuk membuat password baru:</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Atau salin tautan berikut ke browser Anda:</p>
      <p style="word-break: break-all; color: #dc2626; font-size: 13px;">${resetUrl}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset password, amankan akun Anda segera.</p>
    </div>
  `;

  await sendMailWrapper(toEmail, subject, html, 'RESET PASSWORD', resetUrl, rawToken);
}

/**
 * Kirim notifikasi keamanan: Password baru saja diubah
 */
async function sendPasswordChangedNotification(toEmail, name) {
  const subject = 'Pemberitahuan Keamanan: Password Anda Baru Saja Diubah';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Halo, ${name}!</h2>
      <p style="color: #334155; font-size: 16px;">Password akun Anda baru saja berhasil diperbarui pada <strong>${new Date().toLocaleString('id-ID')}</strong>.</p>
      <p style="color: #334155; font-size: 14px;">Semua sesi login di perangkat lain telah kami cabut secara otomatis demi keamanan akun Anda.</p>
      <div style="margin: 20px 0; padding: 12px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
        <p style="color: #991b1b; font-size: 13px; margin: 0;"><strong>Bukan Anda yang melakukan perubahan ini?</strong> Segera reset password Anda atau hubungi administrator sistem.</p>
      </div>
    </div>
  `;

  await sendMailWrapper(toEmail, subject, html, 'NOTIFIKASI UBAH PASSWORD', 'N/A', 'N/A');
}

/**
 * Kirim email verifikasi alamat email baru (Ubah Email)
 */
async function sendEmailChangeVerification(newEmail, name, rawToken) {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email.html?token=${rawToken}&type=change_email`;

  const subject = 'Konfirmasi Perubahan Alamat Email';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Halo, ${name}!</h2>
      <p style="color: #334155; font-size: 16px;">Anda telah meminta untuk mengubah alamat email akun Anda ke <strong>${newEmail}</strong>.</p>
      <p style="color: #334155; font-size: 14px;">Silakan klik tombol di bawah untuk mengonfirmasi dan menyelesaikan pembaruan alamat email:</p>
      <div style="margin: 25px 0; text-align: center;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block;">Konfirmasi Email Baru</a>
      </div>
      <p style="word-break: break-all; color: #2563eb; font-size: 13px;">${verifyUrl}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Tautan ini berlaku selama 24 jam. Email lama Anda tetap aktif sampai verifikasi selesai.</p>
    </div>
  `;

  await sendMailWrapper(newEmail, subject, html, 'VERIFIKASI EMAIL BARU', verifyUrl, rawToken);
}

/**
 * Kirim email konfirmasi penghapusan akun
 */
async function sendAccountDeletionNotification(toEmail, name) {
  const subject = 'Pemberitahuan: Akun Anda Telah Dinonaktifkan (Dihapus)';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #991b1b;">Akun Anda Telah Dinonaktifkan</h2>
      <p style="color: #334155; font-size: 15px;">Halo ${name}, akun Anda telah berhasil dinonaktifkan per <strong>${new Date().toLocaleString('id-ID')}</strong>.</p>
      <p style="color: #64748b; font-size: 13px;">Seluruh data Anda akan dijadwalkan untuk dihapus secara permanen dari server kami setelah periode retensi 30 hari. Terima kasih telah menggunakan layanan kami.</p>
    </div>
  `;

  await sendMailWrapper(toEmail, subject, html, 'HAPUS AKUN', 'N/A', 'N/A');
}

async function sendMailWrapper(toEmail, subject, html, type, link, token) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: env.SMTP.from,
        to: toEmail,
        subject,
        html,
      });
      console.log(`[MAILER] ${type} terkirim ke: ${toEmail}`);
    } catch (err) {
      console.error(`[MAILER ERROR] Gagal kirim email ke ${toEmail}:`, err.message);
      printConsoleSimulation(type, toEmail, link, token);
    }
  } else {
    printConsoleSimulation(type, toEmail, link, token);
  }
}

function printConsoleSimulation(type, toEmail, link, token) {
  console.log('\n======================================================');
  console.log(`📧 [SIMULASI EMAIL - ${type}]`);
  console.log(`Penerima : ${toEmail}`);
  if (link !== 'N/A') console.log(`Tautan   : ${link}`);
  if (token !== 'N/A') console.log(`Token    : ${token}`);
  console.log('======================================================\n');
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedNotification,
  sendEmailChangeVerification,
  sendAccountDeletionNotification,
};
