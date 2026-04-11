// IP Subnet Calculator utility

/**
 * Parse a CIDR notation string and return subnet details.
 * @param {string} cidr - e.g. "192.168.1.0/24"
 * @returns {object} - Subnet details or error
 */
export function calculateSubnet(cidr) {
  if (!cidr || !cidr.includes('/')) {
    return { error: 'Please enter a valid CIDR notation (e.g. 192.168.1.0/24).' }
  }

  const [ipPart, prefixPart] = cidr.split('/')
  const prefix = parseInt(prefixPart, 10)

  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return { error: 'Prefix length must be between 0 and 32.' }
  }

  const octets = ipPart.split('.')
  if (octets.length !== 4) {
    return { error: 'IP address must have exactly 4 octets.' }
  }

  const octetValues = octets.map(o => parseInt(o, 10))
  for (const val of octetValues) {
    if (isNaN(val) || val < 0 || val > 255) {
      return { error: 'Each octet must be between 0 and 255.' }
    }
  }

  const ipInt = octetValues.reduce((acc, val) => (acc << 8) + val, 0) >>> 0
  const maskInt = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0
  const firstHostInt = prefix < 31 ? (networkInt + 1) >>> 0 : networkInt
  const lastHostInt = prefix < 31 ? (broadcastInt - 1) >>> 0 : broadcastInt
  const totalHosts = Math.pow(2, 32 - prefix)
  const usableHosts = prefix < 31 ? Math.max(totalHosts - 2, 0) : (prefix === 31 ? 2 : 1)

  return {
    error: null,
    inputIP: ipPart,
    prefix,
    networkAddress: intToIP(networkInt),
    broadcastAddress: intToIP(broadcastInt),
    subnetMask: intToIP(maskInt),
    wildcardMask: intToIP(~maskInt >>> 0),
    firstHost: intToIP(firstHostInt),
    lastHost: intToIP(lastHostInt),
    totalHosts,
    usableHosts,
    ipClass: getIPClass(octetValues[0]),
    isPrivate: isPrivateIP(networkInt, prefix),
    binaryMask: intToBinaryOctets(maskInt),
    binaryIP: intToBinaryOctets(ipInt),
  }
}

function intToIP(int) {
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF,
  ].join('.')
}

function intToBinaryOctets(int) {
  return [
    ((int >>> 24) & 0xFF).toString(2).padStart(8, '0'),
    ((int >>> 16) & 0xFF).toString(2).padStart(8, '0'),
    ((int >>> 8) & 0xFF).toString(2).padStart(8, '0'),
    (int & 0xFF).toString(2).padStart(8, '0'),
  ].join('.')
}

function getIPClass(firstOctet) {
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  if (firstOctet < 224) return 'C'
  if (firstOctet < 240) return 'D (Multicast)'
  return 'E (Reserved)'
}

function isPrivateIP(ipInt) {
  // 10.0.0.0/8
  if ((ipInt & 0xFF000000) >>> 0 === 0x0A000000) return true
  // 172.16.0.0/12
  if ((ipInt & 0xFFF00000) >>> 0 === 0xAC100000) return true
  // 192.168.0.0/16
  if ((ipInt & 0xFFFF0000) >>> 0 === 0xC0A80000) return true
  // 127.0.0.0/8 loopback
  if ((ipInt & 0xFF000000) >>> 0 === 0x7F000000) return true
  return false
}

export const COMMON_SUBNETS = [
  { cidr: '192.168.1.0/24', description: 'Home/small office network (254 hosts)' },
  { cidr: '10.0.0.0/8', description: 'Large private network (16M hosts)' },
  { cidr: '172.16.0.0/12', description: 'Medium private network (1M hosts)' },
  { cidr: '192.168.0.0/16', description: 'Medium private class C range (65K hosts)' },
  { cidr: '10.10.10.0/24', description: 'DMZ or lab network (254 hosts)' },
  { cidr: '0.0.0.0/0', description: 'Default route (all addresses)' },
  { cidr: '127.0.0.0/8', description: 'Loopback addresses' },
]
