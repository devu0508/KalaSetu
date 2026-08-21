import nodemailer from "nodemailer";
import crypto from "crypto";
import env from "../config/env.js";

/**
 * Create a reusable transporter.
 * - If SMTP credentials are provided, use them.
 * - Otherwise, log emails to the console (dev fallback).
 */
const createTransporter = () => {
  if (env.smtpHost && env.smtpUser && env.smtpPass) {
    return nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }
  return null; // No SMTP configured — will log to console
};

const transporter = createTransporter();

/**
 * Send an email. Falls back to console logging in development.
 */
const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  if (transporter) {
    await transporter.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      html,
    });
    console.log(`📧  Email sent to ${to}: ${subject}`);
  } else {
    console.log("\n" + "=".repeat(60));
    console.log(`📧  EMAIL (no SMTP configured — logging to console)`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body:\n${html}`);
    console.log("=".repeat(60) + "\n");
  }
};

/**
 * Generate a secure random token (hex string).
 */
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash a token for safe storage in the database.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Send email verification email.
 */
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${env.frontendOrigin}/verify-email/${token}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #c8956c, #a0714f); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 28px;">KalaSetu</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Handcrafted Artifacts Marketplace</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #c8956c; margin-top: 0;">Verify Your Email</h2>
        <p>Welcome to KalaSetu! Please verify your email address to unlock all features.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #c8956c, #a0714f); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #999; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">If the button doesn't work, copy and paste this URL:<br/><a href="${verifyUrl}" style="color: #c8956c;">${verifyUrl}</a></p>
      </div>
    </div>
  `;
  await sendEmail(email, "Verify your KalaSetu account", html);
};

/**
 * Send password reset email.
 */
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${env.frontendOrigin}/reset-password/${token}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #c8956c, #a0714f); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 28px;">KalaSetu</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Handcrafted Artifacts Marketplace</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #c8956c; margin-top: 0;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click the button below to choose a new one.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #c8956c, #a0714f); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 13px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">If the button doesn't work, copy and paste this URL:<br/><a href="${resetUrl}" style="color: #c8956c;">${resetUrl}</a></p>
      </div>
    </div>
  `;
  await sendEmail(email, "Reset your KalaSetu password", html);
};
