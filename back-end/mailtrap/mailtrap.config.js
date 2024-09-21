import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";

dotenv.config();

// console.log("Mailtrap Token:", process.env.MAILTRAP_TOKEN);

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Thang Nguyen",
};
