import { EnvEmitter } from "./Events";
import { EmailHost, EmailPort } from "../config/Env";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Logger from "./Logger";
import { EmailPass, EmailUser } from "../config/CheckableEnv";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { exitProcess } from "./Process";
import { ExitCodes } from "../config/Errors";
import { log } from "./Function";

const mailLogger = new Logger("mail");

class EmailQueue {
  queue: Promise<any>;
  transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $this = this;
    this.queue = new Promise((resolve, reject) => {
      EnvEmitter.addListener("loaded", () => {
        const transporter = nodemailer.createTransport({
          // @ts-ignore
          host: EmailHost,
          port: EmailPort,
          secure: true,

          auth: {
            user: EmailUser,
            pass: EmailPass,
          },
        });
        transporter.verify((error) => {
          if (error) {
            reject(error);
          } else {
            log("Server is ready to send emails");
            $this.transporter =
              transporter as unknown as Transporter<SMTPTransport.SentMessageInfo>;
            resolve(transporter);
          }
        });
      });
    }).catch((err) => {
      exitProcess(ExitCodes.EMAIL_ERROR_GENERIC, {
        error: err?.message || String(err),
      });
    });
  }

  addEmail(options: Mail.Options) {
    return (this.queue = this.transporter!.sendMail({
      ...options,
      from: EmailUser,
    }).then((info) => {
      mailLogger.info("Email sent successfully!", info);
    }));
  }
}
const emailQueue = new EmailQueue();
export async function SendEmail(options: Mail.Options) {
  return emailQueue.addEmail(options);
}
