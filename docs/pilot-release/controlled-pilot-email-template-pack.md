# Controlled Pilot Transactional Email Template Pack

Status: configuration-ready; institutional sender and support addresses require owner approval.

These templates are transactional. Provider click and open tracking must remain disabled so authentication and invitation links are not rewritten.

## Sender configuration

- Sender name: `DEC CSO Learning Hub`
- Sender email: `learninghub@[APPROVED INSTITUTIONAL DOMAIN]`
- Reply-to: `[APPROVED PILOT SUPPORT ADDRESS]`
- Support address shown in messages: `[APPROVED PILOT SUPPORT ADDRESS]`

The addresses above must be replaced only after the owner approves the institutional domain and mailbox or alias.

## Supabase Auth: confirm email

Subject:

`Confirm your CSO Learning Hub email`

Body:

```html
<h2>Confirm your email</h2>
<p>Hello,</p>
<p>Confirm this email address to finish creating your individual CSO Learning Hub account.</p>
<p><a href="{{ .ConfirmationURL }}">Confirm my email</a></p>
<p>This link is personal. Do not forward it.</p>
<p>If you did not request this account, you can ignore this message.</p>
<p>Need help? Contact [APPROVED PILOT SUPPORT ADDRESS].</p>
```

## Supabase Auth: password recovery

Subject:

`Reset your CSO Learning Hub password`

Body:

```html
<h2>Reset your password</h2>
<p>Hello,</p>
<p>Use the secure link below to choose a new password for your individual CSO Learning Hub account.</p>
<p><a href="{{ .ConfirmationURL }}">Choose a new password</a></p>
<p>This link is personal and time-limited. Do not forward it.</p>
<p>If you did not request a password reset, you can ignore this message.</p>
<p>Need help? Contact [APPROVED PILOT SUPPORT ADDRESS].</p>
```

## Supabase Auth: confirm email change

Subject:

`Confirm your CSO Learning Hub email change`

Body:

```html
<h2>Confirm your new email</h2>
<p>Hello,</p>
<p>Confirm the requested email change for your individual CSO Learning Hub account.</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email change</a></p>
<p>This link is personal. Do not forward it.</p>
<p>If you did not request this change, contact [APPROVED PILOT SUPPORT ADDRESS].</p>
```

## Hub-managed messages

The Hub renders and sends the following templates from `src/lib/email.ts`:

- DEC administrator onboarding;
- individual learner course invitation;
- replacement course invitation.

The learner invitation names the participating CSO and exact assigned course, states the expiry, links only to the Hub, tells the learner to use the receiving email address and individual account, and warns against forwarding. A replacement generates a new one-time token and invalidates the earlier unused link.

## Configuration verification

Before real pilot invitations:

1. verify SPF and DKIM for the approved sending domain;
2. publish or validate DMARC without changing unrelated DNS;
3. keep provider click and open tracking disabled;
4. set the Supabase Site URL and redirect allowlist to the controlled Hub host;
5. send confirmation, recovery, administrator-onboarding, learner-invitation, and replacement tests to synthetic inboxes;
6. confirm sender, reply-to, link host, expiry, and non-forwarding guidance;
7. verify provider acceptance, delivery, bounce visibility, and redacted application logs.
