import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  InputValidator, 
  RateLimiter, 
  APISecurityHelper, 
  SecurityMonitor,
  initializeSecurity 
} from '../security';

describe('Security Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset rate limiter state
    RateLimiter.cleanup();
    SecurityMonitor.clearViolations();
  });

  describe('InputValidator', () => {
    describe('sanitizeText', () => {
      it('removes dangerous HTML characters', () => {
        const maliciousInput = '<script>alert(\"xss\")</script>';
        const sanitized = InputValidator.sanitizeText(maliciousInput);
        
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).toContain('&lt;script&gt;');
      });

      it('handles special characters', () => {
        const input = 'Test & \"quotes\" and \\'apostrophes\\'';
        const sanitized = InputValidator.sanitizeText(input);
        
        expect(sanitized).toContain('&amp;');
        expect(sanitized).toContain('&quot;');
        expect(sanitized).toContain('&#x27;');
      });

      it('trims whitespace', () => {
        const input = '  spaced text  ';
        const sanitized = InputValidator.sanitizeText(input);
        
        expect(sanitized).toBe('spaced text');
      });
    });

    describe('isValidEmail', () => {
      it('accepts valid email addresses', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@example.org'
        ];

        validEmails.forEach(email => {
          expect(InputValidator.isValidEmail(email)).toBe(true);
        });
      });

      it('rejects invalid email addresses', () => {
        const invalidEmails = [
          'invalid-email',
          '@domain.com',
          'user@',
          'user space@domain.com',
          'a'.repeat(250) + '@domain.com' // Too long
        ];

        invalidEmails.forEach(email => {
          expect(InputValidator.isValidEmail(email)).toBe(false);
        });
      });
    });

    describe('isValidURL', () => {
      it('accepts valid URLs', () => {
        const validURLs = [
          'https://example.com',
          'http://localhost:3000',
          'https://sub.domain.com/path?query=value'
        ];

        validURLs.forEach(url => {
          expect(InputValidator.isValidURL(url)).toBe(true);
        });
      });

      it('rejects invalid URLs', () => {
        const invalidURLs = [
          'not-a-url',
          'ftp://old-protocol.com',
          'javascript:alert(1)'
        ];

        invalidURLs.forEach(url => {
          expect(InputValidator.isValidURL(url)).toBe(false);
        });
      });
    });

    describe('validateRecipeInput', () => {
      it('validates and sanitizes recipe input', () => {
        const input = 'Mango <script>alert(1)</script> smoothie';
        const result = InputValidator.validateRecipeInput(input);
        
        expect(result.isValid).toBe(true);
        expect(result.sanitized).not.toContain('<script>');
        expect(result.errors).toHaveLength(0);
      });

      it('rejects empty input', () => {
        const result = InputValidator.validateRecipeInput('');
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Input cannot be empty');
      });

      it('rejects overly long input', () => {
        const longInput = 'a'.repeat(1001);
        const result = InputValidator.validateRecipeInput(longInput);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Input too long (max 1000 characters)');
      });

      it('detects potential script injection', () => {
        const maliciousInputs = [
          'onclick=\"alert(1)\"',
          'javascript:void(0)',
          'onerror=\"malicious()\"'
        ];

        maliciousInputs.forEach(input => {
          const result = InputValidator.validateRecipeInput(input);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain('Invalid characters detected');
        });
      });
    });
  });

  describe('RateLimiter', () => {
    it('allows requests within limit', () => {
      const result1 = RateLimiter.checkLimit('test-key', 5, 60000);
      const result2 = RateLimiter.checkLimit('test-key', 5, 60000);
      
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
    });

    it('blocks requests exceeding limit', () => {
      const limit = 2;
      const windowMs = 60000;
      
      // Use up the limit
      RateLimiter.checkLimit('test-key', limit, windowMs);
      RateLimiter.checkLimit('test-key', limit, windowMs);
      
      // This should be blocked
      const result = RateLimiter.checkLimit('test-key', limit, windowMs);
      expect(result.allowed).toBe(false);
    });

    it('resets after time window', () => {
      vi.useFakeTimers();
      
      const limit = 1;
      const windowMs = 1000;
      
      // Use up the limit
      RateLimiter.checkLimit('test-key', limit, windowMs);
      
      // Should be blocked immediately
      let result = RateLimiter.checkLimit('test-key', limit, windowMs);
      expect(result.allowed).toBe(false);
      
      // Fast forward past the window
      vi.advanceTimersByTime(1001);
      
      // Should be allowed again
      result = RateLimiter.checkLimit('test-key', limit, windowMs);
      expect(result.allowed).toBe(true);
      
      vi.useRealTimers();
    });

    it('handles different keys independently', () => {
      const limit = 1;
      const windowMs = 60000;
      
      RateLimiter.checkLimit('key1', limit, windowMs);
      RateLimiter.checkLimit('key2', limit, windowMs);
      
      // Both keys should still be allowed
      const result1 = RateLimiter.checkLimit('key1', limit, windowMs);
      const result2 = RateLimiter.checkLimit('key2', limit, windowMs);
      
      expect(result1.allowed).toBe(false); // key1 is at limit
      expect(result2.allowed).toBe(false); // key2 is at limit
    });
  });

  describe('APISecurityHelper', () => {
    it('adds security headers to requests', () => {
      const headers = APISecurityHelper.addSecurityHeaders();
      
      expect(headers.get('X-Requested-With')).toBe('XMLHttpRequest');
      expect(headers.get('X-Client-Version')).toBeTruthy();
      expect(headers.get('X-Request-Time')).toBeTruthy();
    });

    it('preserves existing headers', () => {
      const existingHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      
      const headers = APISecurityHelper.addSecurityHeaders(existingHeaders);
      
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('X-Requested-With')).toBe('XMLHttpRequest');
    });

    it('generates and retrieves CSRF tokens', () => {
      const token1 = APISecurityHelper.getCSRFToken();
      const token2 = APISecurityHelper.getCSRFToken();
      
      expect(token1).toBeTruthy();
      expect(token1).toBe(token2); // Should return same token
      expect(token1).toMatch(/^[a-f0-9]{64}$/); // Should be 64 char hex string
    });

    it('validates response status codes', () => {
      const validResponse = { status: 200, headers: new Headers() } as Response;
      const invalidResponse = { status: 500, headers: new Headers() } as Response;
      
      expect(APISecurityHelper.validateResponse(validResponse)).toBe(true);
      expect(APISecurityHelper.validateResponse(invalidResponse)).toBe(false);
    });
  });

  describe('SecurityMonitor', () => {
    it('logs security violations', () => {
      const violationType = 'test_violation';
      const details = { userId: '123', action: 'suspicious_activity' };
      
      SecurityMonitor.logViolation(violationType, details);
      
      const violations = SecurityMonitor.getViolations();
      expect(violations).toHaveLength(1);
      expect(violations[0].type).toBe(violationType);
      expect(violations[0].details).toEqual(details);
      expect(violations[0].timestamp).toBeTruthy();
    });

    it('limits violation history', () => {
      // Log more than 100 violations
      for (let i = 0; i < 105; i++) {
        SecurityMonitor.logViolation('test_violation', { count: i });
      }
      
      const violations = SecurityMonitor.getViolations();
      expect(violations).toHaveLength(100); // Should be capped at 100
      
      // Should keep the most recent ones
      expect(violations[99].details.count).toBe(104);
    });

    it('clears violations', () => {
      SecurityMonitor.logViolation('test_violation', {});
      expect(SecurityMonitor.getViolations()).toHaveLength(1);
      
      SecurityMonitor.clearViolations();
      expect(SecurityMonitor.getViolations()).toHaveLength(0);
    });
  });

  describe('initializeSecurity', () => {
    it('initializes security system without errors', () => {
      expect(() => initializeSecurity()).not.toThrow();
    });

    it('generates initial CSRF token', () => {
      initializeSecurity();
      
      const token = APISecurityHelper.getCSRFToken();
      expect(token).toBeTruthy();
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});