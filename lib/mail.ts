import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Zenq - Reset password confirmation",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Zenq - Verify your email address",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
  });
};
