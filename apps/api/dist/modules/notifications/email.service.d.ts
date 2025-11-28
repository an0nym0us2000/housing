import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    private readonly fromEmail;
    private readonly fromName;
    constructor(configService: ConfigService);
    sendEmail(options: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }): Promise<boolean>;
    getWelcomeEmailHtml(name: string): string;
    getNewLeadEmailHtml(lead: any, listing: any): string;
    getVisitConfirmationEmailHtml(visit: any, listing: any): string;
    getVisitReminderEmailHtml(visit: any, listing: any, hoursUntil: number): string;
    getTaskReminderEmailHtml(task: any): string;
    getListingApprovedEmailHtml(listing: any): string;
    getListingRejectedEmailHtml(listing: any, reason: string): string;
}
//# sourceMappingURL=email.service.d.ts.map