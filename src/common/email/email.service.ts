import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  from?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailProvider = this.configService.get<string>('EMAIL_PROVIDER', 'smtp');

    if (emailProvider === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: parseInt(this.configService.get<string>('SMTP_PORT', '587'), 10),
        secure: this.configService.get<string>('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
      this.logger.log('Email service initialized with SMTP');
    } else if (emailProvider === 'gmail') {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('GMAIL_USER'),
          pass: this.configService.get<string>('GMAIL_PASSWORD'),
        },
      });
      this.logger.log('Email service initialized with Gmail');
    } else {
      this.logger.warn('Email provider not configured, using test account');
      nodemailer.createTestAccount().then((testAccount) => {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      });
    }
  }

  async sendEmail(emailOptions: EmailOptions): Promise<any> {
    try {
      const mailOptions = {
        from:
          emailOptions.from ||
          this.configService.get<string>('EMAIL_FROM', 'noreply@edhub.com'),
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text,
        cc: emailOptions.cc,
        bcc: emailOptions.bcc,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${emailOptions.to}`);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailOptions.to}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(
    email: string,
    firstname: string,
    lastname: string,
  ): Promise<any> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to EdHub, ${firstname}!</h2>
        <p>Dear ${firstname} ${lastname},</p>
        <p>Thank you for registering with EdHub. We're excited to have you join our learning community.</p>
        <p>You can now log in to your account and start exploring our courses.</p>
        <p>Best regards,<br>The EdHub Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to EdHub',
      html,
      text: `Welcome to EdHub, ${firstname}! Thank you for registering.`,
    });
  }

  async sendSchoolApprovalEmail(email: string, schoolName: string): Promise<any> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>School Request Approved</h2>
        <p>Dear School Administrator,</p>
        <p>We are pleased to inform you that your school request for <strong>${schoolName}</strong> has been approved.</p>
        <p>You can now access your school dashboard and start setting up your courses and classes.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The EdHub Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `School Approved: ${schoolName}`,
      html,
      text: `Your school ${schoolName} has been approved.`,
    });
  }

  async sendSchoolRejectionEmail(
    email: string,
    schoolName: string,
    reason?: string,
  ): Promise<any> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>School Request Status Update</h2>
        <p>Dear School Administrator,</p>
        <p>We regret to inform you that your school request for <strong>${schoolName}</strong> has been rejected.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Please contact our support team if you would like more information or wish to resubmit your request.</p>
        <p>Best regards,<br>The EdHub Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `School Request Update: ${schoolName}`,
      html,
      text: `Your school request for ${schoolName} has been reviewed.`,
    });
  }

  async sendEnrollmentConfirmation(
    email: string,
    firstName: string,
    courseName: string,
  ): Promise<any> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Enrollment Confirmed</h2>
        <p>Dear ${firstName},</p>
        <p>Congratulations! You have successfully enrolled in <strong>${courseName}</strong>.</p>
        <p>You can now access the course materials and start learning.</p>
        <p>Best regards,<br>The EdHub Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Course Enrollment: ${courseName}`,
      html,
      text: `You have enrolled in ${courseName}.`,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
    firstname: string,
  ): Promise<any> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Dear ${firstname},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, you can ignore this email.</p>
        <p>Best regards,<br>The EdHub Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
      text: `Reset your password using this link: ${resetLink}`,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email transporter connection verified');
      return true;
    } catch (error) {
      this.logger.error('Email transporter verification failed:', error);
      return false;
    }
  }

  async sendSchoolAdminInvitation(
    email: string,
    schoolName: string,
    invitationLink: string,
  ): Promise<any> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're Invited to Join ${schoolName} as Administrator</h2>
        <p>Hello,</p>
        <p>You have been invited to become an administrator of <strong>${schoolName}</strong> on EdHub.</p>
        <p>Click the button below to accept the invitation and set up your account:</p>
        <p>
          <a href="${invitationLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Accept Invitation
          </a>
        </p>
        <p>This invitation expires in 7 days.</p>
        <p>If you didn't expect this invitation, you can ignore this email.</p>
        <p>Best regards,<br>The EdHub Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `Invitation to Join ${schoolName} as Administrator`,
      html,
      text: `You have been invited to become an administrator of ${schoolName}. Accept the invitation using this link: ${invitationLink}`,
    });
  }
}
