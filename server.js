const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { exec } = require("child_process");
const os = require("os");
require('dotenv').config();
const path = require('path');

// server used to send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'build')));
app.use("/", router);

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || EMAIL_ADDRESS;
const PORT = 5000;

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { windowsHide: true }, (error, stdout, stderr) => {
      if (error && !stdout) {
        return reject(stderr || error);
      }
      resolve(stdout || '');
    });
  });
}

function parseWindowsPids(stdout) {
  return Array.from(new Set(stdout
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && line.toUpperCase().includes('LISTENING'))
    .map(line => {
      const parts = line.split(/\s+/);
      return parts[parts.length - 1];
    })
    .filter(pid => pid && !isNaN(pid) && pid !== String(process.pid))));
}

function parseUnixPids(stdout) {
  return stdout
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(pid => pid && pid !== String(process.pid));
}

async function findPidsOnPort(port) {
  try {
    if (os.platform() === 'win32') {
      const stdout = await execCommand(`netstat -ano | findstr :${port}`);
      return parseWindowsPids(stdout);
    }

    const stdout = await execCommand(`lsof -iTCP:${port} -sTCP:LISTEN -t || true`);
    return parseUnixPids(stdout);
  } catch (error) {
    return [];
  }
}

async function killPid(pid) {
  try {
    if (os.platform() === 'win32') {
      await execCommand(`taskkill /PID ${pid} /F`);
    } else {
      await execCommand(`kill -9 ${pid}`);
    }
    console.log(`Killed process ${pid} on port ${PORT}`);
  } catch (error) {
    const message = String(error || '');
    if (message.includes('not found') || message.includes('No such process')) {
      console.log(`Process ${pid} already stopped; continuing.`);
      return;
    }
    console.error(`Failed to kill process ${pid} on port ${PORT}:`, error);
    throw error;
  }
}

async function ensurePortIsFree(port) {
  const pids = await findPidsOnPort(port);
  if (!pids.length) {
    return;
  }

  for (const pid of pids) {
    if (pid === String(process.pid)) {
      continue;
    }
    await killPid(pid);
  }
}

let contactEmail = null;
if (EMAIL_ADDRESS && EMAIL_PASS && EMAIL_ADDRESS !== 'you@example.com') {
  contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASS,
    },
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  contactEmail.verify((error) => {
    if (error) {
      console.error('Email verify failed:', error);
      contactEmail = null;
    } else {
      console.log('Email transporter is ready');
    }
  });
} else {
  console.log('Email credentials not set. Contact form will be disabled.');
}

router.post("/contact", async (req, res) => {
  const {
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    message = '',
  } = req.body || {};

  const name = `${firstName} ${lastName}`.trim();
  const mail = {
    from: `Portfolio Contact <${EMAIL_ADDRESS}>`,
    replyTo: email || EMAIL_ADDRESS,
    to: EMAIL_TO,
    subject: "Portfolio - Contact Form",
    html: `<p><strong>Name:</strong> ${name || 'Visitor'}</p>
           <p><strong>Email:</strong> ${email || 'Not provided'}</p>
           <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
           <p><strong>Message:</strong><br>${message || 'No message provided'}</p>`,
  };

  if (!contactEmail) {
    return res.status(503).json({ code: 503, status: 'Email service not configured' });
  }

  try {
    const info = await contactEmail.sendMail(mail);
    console.log('Contact form email sent:', info.response || info.messageId);
    return res.json({ code: 200, status: 'Message Sent' });
  } catch (error) {
    console.error('Contact email send failed:', error);
    return res.status(500).json({
      code: 500,
      status: 'Failed to send email',
      error: error.message || error,
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

async function startServer() {
  await ensurePortIsFree(PORT);

  const server = app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use and could not be freed automatically.`);
      process.exit(1);
    }
    throw err;
  });
}

startServer().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});