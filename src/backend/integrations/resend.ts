import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendMatchAlertEmail(to: string, roleTitle: string, matchScorePct: number) {
  const subject = `🎯 New Internal Role Match: ${roleTitle} (${matchScorePct}% Match)`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>New Internal Career Opportunity</h2>
      <p>Your profile matched with <strong>${roleTitle}</strong> at <strong>${matchScorePct}% overall compatibility</strong>.</p>
      <p>Log in to TalentLens to review the match breakdown and evidence citations.</p>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: 'TalentLens <notifications@talentlens.ai>',
        to,
        subject,
        html,
      });
      return;
    } catch (err) {
      console.warn('⚠️ Resend email delivery failed, falling back to stdout log:', err);
    }
  }

  console.log(`✉️ [MOCK EMAIL LOG] To: ${to} | Subject: ${subject}`);
}

export async function sendRoadmapUpdatedEmail(to: string, roleTitle: string, progressPct: number) {
  const subject = `📈 Career Mobility Roadmap Update: ${roleTitle} (${progressPct}% Completed)`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Roadmap Progress Updated</h2>
      <p>Great progress! Your mobility roadmap for <strong>${roleTitle}</strong> is now <strong>${progressPct}% complete</strong>.</p>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: 'TalentLens <notifications@talentlens.ai>',
        to,
        subject,
        html,
      });
      return;
    } catch (err) {
      console.warn('⚠️ Resend email delivery failed, falling back to stdout log:', err);
    }
  }

  console.log(`✉️ [MOCK EMAIL LOG] To: ${to} | Subject: ${subject}`);
}
