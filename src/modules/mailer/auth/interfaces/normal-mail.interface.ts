export interface NormalMail {
  to: string;
  userName: string;
  verificationToken: string;
  exp?: string;
}
