import { Plugin } from "vite";
import { SECURITY_HEADERS } from "./src/utils/security";

// Vite plugin to add security headers in development
export const securityHeadersPlugin = (): Plugin => {
  return {
    name: "security-headers",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Add security headers to all responses
        Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
          if (value) {
            res.setHeader(header, value);
          }
        });

        // Add CORS headers for development
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, X-CSRF-Token, X-Request-Time, X-Client-Version"
        );

        // Handle preflight requests
        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        next();
      });
    },
  };
};

// Production security configuration for static deployment
export const generateSecurityConfig = () => {
  const headers = SECURITY_HEADERS;

  // Configuration for various deployment platforms
  return {
    // Vercel _headers file format
    vercel: `/*
  X-Content-Type-Options: ${headers["X-Content-Type-Options"]}
  X-Frame-Options: ${headers["X-Frame-Options"]}
  X-XSS-Protection: ${headers["X-XSS-Protection"]}
  Referrer-Policy: ${headers["Referrer-Policy"]}
  Permissions-Policy: ${headers["Permissions-Policy"]}
  ${
    headers["Strict-Transport-Security"]
      ? `Strict-Transport-Security: ${headers["Strict-Transport-Security"]}`
      : ""
  }
  Content-Security-Policy: ${headers["Content-Security-Policy"]}`,

    // Netlify _headers file format
    netlify: `/*
  X-Content-Type-Options: ${headers["X-Content-Type-Options"]}
  X-Frame-Options: ${headers["X-Frame-Options"]}
  X-XSS-Protection: ${headers["X-XSS-Protection"]}
  Referrer-Policy: ${headers["Referrer-Policy"]}
  Permissions-Policy: ${headers["Permissions-Policy"]}
  ${
    headers["Strict-Transport-Security"]
      ? `Strict-Transport-Security: ${headers["Strict-Transport-Security"]}`
      : ""
  }
  Content-Security-Policy: ${headers["Content-Security-Policy"]}`,

    // Apache .htaccess format
    apache: `<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "${
    headers["X-Content-Type-Options"]
  }"
  Header always set X-Frame-Options "${headers["X-Frame-Options"]}"
  Header always set X-XSS-Protection "${headers["X-XSS-Protection"]}"
  Header always set Referrer-Policy "${headers["Referrer-Policy"]}"
  Header always set Permissions-Policy "${headers["Permissions-Policy"]}"
  ${
    headers["Strict-Transport-Security"]
      ? `Header always set Strict-Transport-Security "${headers["Strict-Transport-Security"]}"`
      : ""
  }
  Header always set Content-Security-Policy "${
    headers["Content-Security-Policy"]
  }"
</IfModule>`,

    // Nginx configuration format
    nginx: `location / {
  add_header X-Content-Type-Options "${
    headers["X-Content-Type-Options"]
  }" always;
  add_header X-Frame-Options "${headers["X-Frame-Options"]}" always;
  add_header X-XSS-Protection "${headers["X-XSS-Protection"]}" always;
  add_header Referrer-Policy "${headers["Referrer-Policy"]}" always;
  add_header Permissions-Policy "${headers["Permissions-Policy"]}" always;
  ${
    headers["Strict-Transport-Security"]
      ? `add_header Strict-Transport-Security "${headers["Strict-Transport-Security"]}" always;`
      : ""
  }
  add_header Content-Security-Policy "${
    headers["Content-Security-Policy"]
  }" always;
}`,
  };
};

export default { securityHeadersPlugin, generateSecurityConfig };
