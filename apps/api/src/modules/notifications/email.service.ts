import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get('EMAIL_FROM', 'noreply@housing.com');
    this.fromName = this.configService.get('EMAIL_FROM_NAME', 'Housing Platform');

    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: this.configService.get('SMTP_SECURE', false),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  // Template: Welcome Email
  getWelcomeEmailHtml(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Housing Platform!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining our platform! We're excited to have you.</p>
            <p>You can now:</p>
            <ul>
              <li>Browse thousands of properties</li>
              <li>Save your favorite listings</li>
              <li>Schedule property visits</li>
              <li>Connect with owners and brokers</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}" class="button">
                Explore Properties
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template: New Lead Notification
  getNewLeadEmailHtml(lead: any, listing: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .lead-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Lead Received!</h1>
          </div>
          <div class="content">
            <p>Great news! Someone is interested in your property.</p>

            <div class="lead-info">
              <h3>Property Details</h3>
              <div class="info-row">
                <strong>Property:</strong>
                <span>${listing?.title || 'N/A'}</span>
              </div>
              <div class="info-row">
                <strong>Location:</strong>
                <span>${listing?.city?.name || 'N/A'}</span>
              </div>

              <h3 style="margin-top: 20px;">Lead Information</h3>
              <div class="info-row">
                <strong>Name:</strong>
                <span>${lead.name}</span>
              </div>
              <div class="info-row">
                <strong>Phone:</strong>
                <span>${lead.phone}</span>
              </div>
              ${
                lead.email
                  ? `
              <div class="info-row">
                <strong>Email:</strong>
                <span>${lead.email}</span>
              </div>
              `
                  : ''
              }
              ${
                lead.message
                  ? `
              <div style="margin-top: 15px;">
                <strong>Message:</strong>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 10px;">
                  ${lead.message}
                </p>
              </div>
              `
                  : ''
              }
            </div>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}/dashboard" class="button">
                View in Dashboard
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template: Visit Confirmation
  getVisitConfirmationEmailHtml(visit: any, listing: any): string {
    const visitDate = new Date(visit.scheduledAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .visit-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
          .button { display: inline-block; padding: 12px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Visit Confirmed!</h1>
          </div>
          <div class="content">
            <p>Your property visit has been confirmed.</p>

            <div class="visit-info">
              <h3>Visit Details</h3>
              <p><strong>Property:</strong> ${listing?.title || 'N/A'}</p>
              <p><strong>Address:</strong> ${listing?.address || 'N/A'}, ${listing?.city?.name || 'N/A'}</p>
              <p><strong>Date & Time:</strong> ${visitDate}</p>
              <p><strong>Contact Person:</strong> ${visit.visitorName}</p>
              <p><strong>Phone:</strong> ${visit.visitorPhone}</p>
            </div>

            <p><strong>Important:</strong> Please arrive on time and bring a valid ID for verification.</p>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}/dashboard" class="button">
                View My Visits
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template: Visit Reminder
  getVisitReminderEmailHtml(visit: any, listing: any, hoursUntil: number): string {
    const visitDate = new Date(visit.scheduledAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .reminder-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Visit Reminder</h1>
          </div>
          <div class="content">
            <div class="reminder-box">
              <h2 style="margin-top: 0;">Your visit is in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}!</h2>
              <p><strong>Property:</strong> ${listing?.title || 'N/A'}</p>
              <p><strong>Address:</strong> ${listing?.address || 'N/A'}</p>
              <p><strong>Date & Time:</strong> ${visitDate}</p>
            </div>

            <p>Please remember to:</p>
            <ul>
              <li>Arrive on time</li>
              <li>Bring a valid ID</li>
              <li>Note down any questions you have</li>
            </ul>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}/dashboard" class="button">
                View Visit Details
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template: Task Reminder
  getTaskReminderEmailHtml(task: any): string {
    const dueDate = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'No due date';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .task-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .priority { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .priority-high { background: #fee2e2; color: #991b1b; }
          .priority-urgent { background: #fecaca; color: #7f1d1d; }
          .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Task Reminder</h1>
          </div>
          <div class="content">
            <div class="task-box">
              <h2 style="margin-top: 0;">${task.title}</h2>
              <p><span class="priority priority-${task.priority.toLowerCase()}">${task.priority} PRIORITY</span></p>
              ${task.description ? `<p>${task.description}</p>` : ''}
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p><strong>Status:</strong> ${task.status.replace('_', ' ')}</p>
            </div>

            <p>This task requires your attention. Please update the status once completed.</p>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}/tasks" class="button">
                View Task
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template: Listing Approved
  getListingApprovedEmailHtml(listing: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .success-box { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Listing Approved!</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <h2>🎉 Congratulations!</h2>
              <p>Your property listing has been approved and is now live.</p>
            </div>

            <p><strong>Property:</strong> ${listing.title}</p>
            <p>Your listing is now visible to thousands of potential buyers/tenants on our platform.</p>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}/listings/${listing.id}" class="button">
                View Your Listing
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template: Listing Rejected
  getListingRejectedEmailHtml(listing: any, reason: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .reason-box { background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Listing Needs Attention</h1>
          </div>
          <div class="content">
            <p>We've reviewed your listing and it needs some modifications before we can publish it.</p>

            <p><strong>Property:</strong> ${listing.title}</p>

            <div class="reason-box">
              <h3 style="margin-top: 0;">Reason for Rejection:</h3>
              <p>${reason}</p>
            </div>

            <p>Please update your listing and resubmit for review.</p>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${this.configService.get('WEB_URL', 'http://localhost:3000')}/dashboard" class="button">
                Edit Listing
              </a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Housing Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
