# Security Configuration Guide

This document outlines the security measures implemented in the Tropical AI Chef application and provides deployment configuration guidance.

## Security Features Implemented

### 1. Content Security Policy (CSP)

- **Default source**: Only allows resources from the same origin
- **Script sources**: Restricts script execution to trusted sources
- **Style sources**: Controls CSS loading from approved sources
- **Image sources**: Allows images from HTTPS sources and data URLs
- **Connect sources**: Restricts API calls to approved endpoints
- **Frame protection**: Prevents clickjacking attacks

### 2. Security Headers

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents embedding in frames
- **X-XSS-Protection**: Enables XSS filtering
- **Referrer-Policy**: Controls referrer information leakage
- **Permissions-Policy**: Restricts browser API access
- **Strict-Transport-Security**: Forces HTTPS connections (production only)

### 3. Input Validation & Sanitization

- **Recipe input validation**: Checks for suspicious patterns and excessive special characters
- **HTML sanitization**: Removes HTML tags and prevents XSS
- **Text input sanitization**: Escapes special characters
- **Email validation**: Validates email format
- **URL validation**: Ensures valid URL format

### 4. Rate Limiting

- **Recipe generation**: 30 requests per minute per user
- **Form submissions**: 10 submissions per minute per form
- **API requests**: Configurable rate limiting per endpoint
- **Automatic cleanup**: Expired rate limit entries are cleaned up

### 5. CSRF Protection

- **Token generation**: Cryptographically secure tokens
- **Request validation**: All API requests include CSRF tokens
- **Session storage**: Tokens stored securely in session storage

### 6. Security Monitoring

- **Violation logging**: CSP violations are logged and monitored
- **Error tracking**: Security-related errors are tracked
- **Rate limit monitoring**: Rate limit violations are logged

## Deployment Configuration

### Vercel

Add the following to your `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(self)"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.openai.com http://localhost:11434 https://huggingface.co https://api.huggingface.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
        }
      ]
    }
  ]
}
```

### Netlify

Create a `_headers` file in the `public` directory (already created):

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(self)
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.openai.com http://localhost:11434 https://huggingface.co https://api.huggingface.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

### Apache (.htaccess)

Create a `.htaccess` file in your web root:

```apache
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(self)"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.openai.com http://localhost:11434 https://huggingface.co https://api.huggingface.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
</IfModule>
```

### Nginx

Add to your server configuration:

```nginx
location / {
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(self)" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.openai.com http://localhost:11434 https://huggingface.co https://api.huggingface.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;
}
```

## Security Best Practices

### For Developers

1. **Always validate input**: Use the `InputValidator` class for all user inputs
2. **Use secure requests**: Use the `secureRequest` function for API calls
3. **Implement rate limiting**: Use `checkRateLimit` for user actions
4. **Monitor violations**: Use `SecurityMonitor` to track security issues
5. **Sanitize output**: Always sanitize data before displaying to users

### For Deployment

1. **Enable HTTPS**: Always use HTTPS in production
2. **Update headers**: Keep security headers up to date
3. **Monitor CSP**: Check for CSP violations in production
4. **Regular audits**: Perform regular security audits
5. **Environment separation**: Use different configurations for dev/prod

### For API Integration

1. **Validate responses**: Always validate API responses
2. **Use CSRF tokens**: Include CSRF tokens in all requests
3. **Rate limit**: Implement rate limiting for external API calls
4. **Error handling**: Handle security-related errors appropriately
5. **Logging**: Log security events for monitoring

## Testing Security

### Development Testing

1. Run the application with CSP enabled
2. Check browser console for CSP violations
3. Test input validation with various inputs
4. Verify rate limiting functionality
5. Test CSRF protection mechanisms

### Production Testing

1. Use security scanning tools (e.g., OWASP ZAP)
2. Perform penetration testing
3. Check security headers with tools like securityheaders.com
4. Monitor for CSP violations
5. Review security logs regularly

## Security Headers Verification

Use these tools to verify your security headers:

- [securityheaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com)

## Emergency Response

If a security issue is discovered:

1. Immediately assess the impact
2. Implement temporary mitigations
3. Update security configurations
4. Monitor for exploitation attempts
5. Document the incident and response

## Updates and Maintenance

- Review and update CSP regularly
- Monitor for new security vulnerabilities
- Update dependencies regularly
- Review security logs weekly
- Update security configurations as needed

This security configuration provides a strong foundation for protecting the Tropical AI Chef application against common web security threats while maintaining functionality.
