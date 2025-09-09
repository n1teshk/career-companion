# Security Policy

## Overview

Career Companion takes security seriously. This document outlines our security practices and how to report security issues.

## Environment Variables & Secrets Management

### ✅ DO:
- Use environment variables for all sensitive data (API keys, secrets, passwords)
- Use the `.env.example` file as a template for required environment variables
- Keep your `.env` file local and never commit it to version control
- Use Rails credentials for production secrets: `rails credentials:edit`
- Rotate API keys and secrets regularly

### ❌ DON'T:
- Never hardcode secrets, API keys, or passwords in source code
- Never commit `.env` files to git
- Never push credentials or master keys to repositories
- Don't log sensitive information

## Required Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# Edit .env with your actual values
```

### Critical Variables:
- `SECRET_KEY_BASE` - Rails secret key
- `DEVISE_SECRET_KEY` - Devise authentication secret
- `OPENAI_API_KEY` - AI service API key
- `DATABASE_URL` - Database connection string

## Git Security

### Pre-commit Checks:
- Review all changes before committing
- Never commit files containing secrets
- Use `git diff --cached` to review staged changes
- Consider using pre-commit hooks for secret scanning

### If You Accidentally Commit a Secret:

1. **Immediately rotate the compromised secret/API key**
2. Remove the secret from the codebase
3. Commit the fix with a clear security message
4. For sensitive secrets, consider rewriting git history

## API Security

### AI Service Integration:
- All AI API keys are stored in environment variables
- Rate limiting implemented to prevent API abuse
- Timeout configurations prevent hanging requests
- Error handling doesn't expose internal details

### File Upload Security:
- File type validation for uploaded files
- Size limits enforced (configurable via `ApplicationConfig.max_pdf_size_mb`)
- Temporary file cleanup after processing
- No permanent storage of sensitive uploaded content

## Data Protection

### User Data:
- Passwords hashed using Devise (bcrypt)
- Session data encrypted
- Temporary analysis results cached with expiration
- No permanent storage of LinkedIn profile data

### Privacy:
- LinkedIn analysis results cached for 7 days max
- Session-based temporary data storage
- No sharing of user data with third parties
- Secure PDF processing without permanent storage

## Production Security

### Application Security:
- HTTPS enforced in production
- Secure headers configuration
- CSRF protection enabled
- SQL injection protection via parameterized queries

### Infrastructure:
- Database connection encryption
- Regular security updates
- Monitoring and alerting for suspicious activity
- Backup encryption

## Security Headers

The application implements security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

## Monitoring & Incident Response

### Security Monitoring:
- Application performance monitoring
- Error tracking with security context
- Failed authentication attempt logging
- Unusual API usage pattern detection

### Incident Response:
1. Identify and contain the issue
2. Assess the impact and scope
3. Implement immediate fixes
4. Notify affected users if necessary
5. Document and learn from the incident

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: [your-security-email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if available)

We will respond within 48 hours and work with you to address the issue.

## Security Best Practices for Developers

### Code Review:
- All code changes require review
- Security-focused review for authentication/authorization changes
- Dependency security scanning
- Static code analysis

### Dependencies:
- Regular dependency updates
- Security audit of third-party packages
- Minimal dependency principle
- Lock file integrity checking

### Testing:
- Security test cases for authentication flows
- Input validation testing
- API endpoint security testing
- File upload security testing

## Compliance & Standards

- Following OWASP Top 10 security guidelines
- Regular security assessments
- Secure coding practices training
- Security-first development approach

---

**Last Updated**: January 2025  
**Version**: 1.0

For questions about this security policy, please contact the development team.