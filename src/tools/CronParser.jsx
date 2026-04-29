import { useState } from 'react'
import { copyText } from '../utils/clipboard'
import cronstrue from 'cronstrue'
import { useSEO } from '../hooks/useSEO'
import '../styles/pages/CronParser.css'

export default function CronParser() {
  useSEO({
    title: 'Online Cron Expression Parser and Generator',
    description: 'Free online cron parser and generator. Create cron expressions with easy dropdowns or parse existing cron syntax into human-readable explanations. Perfect for server scheduling and automation.',
    keywords: 'online cron tool, cron parser, cron generator, cron expression builder, scheduling tool, crontab help'
  })
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')
  const [rawCron, setRawCron] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const generateCronString = () => {
    const cronExpression = `${minute} ${hour} ${day} ${month} ${weekday}`
    return cronExpression
  }

  const handleGenerateCron = () => {
    setError('')
    try {
      const cronString = generateCronString()
      const description = cronstrue.toString(cronString)
      setOutput(description)
      setRawCron(cronString)
    } catch (err) {
      setError(`Invalid cron expression: ${err.message}`)
      setOutput('')
    }
  }

  const handleParseCron = () => {
    setError('')
    try {
      if (!rawCron.trim()) {
        setError('Please enter a cron expression')
        setOutput('')
        return
      }

      const description = cronstrue.toString(rawCron)
      setOutput(description)

      const parts = rawCron.trim().split(/\s+/)
      if (parts.length === 5) {
        setMinute(parts[0])
        setHour(parts[1])
        setDay(parts[2])
        setMonth(parts[3])
        setWeekday(parts[4])
      }
    } catch (err) {
      setError(`Invalid cron expression: ${err.message}`)
      setOutput('')
    }
  }

  const handleCopy = () => {
    if (!rawCron) {
      setError('Nothing to copy. Please generate a cron expression first.')
      return
    }
    copyText(rawCron)
  }

  const handleClear = () => {
    setMinute('*')
    setHour('*')
    setDay('*')
    setMonth('*')
    setWeekday('*')
    setRawCron('')
    setOutput('')
    setError('')
  }

  const minuteOptions = ['*', ...Array.from({ length: 60 }, (_, i) => String(i))]
  const hourOptions = ['*', ...Array.from({ length: 24 }, (_, i) => String(i))]
  const dayOptions = ['*', ...Array.from({ length: 31 }, (_, i) => String(i + 1))]
  const monthOptions = ['*', ...Array.from({ length: 12 }, (_, i) => String(i + 1))]
  const weekdayOptions = ['*', '0 (Sunday)', '1 (Monday)', '2 (Tuesday)', '3 (Wednesday)', '4 (Thursday)', '5 (Friday)', '6 (Saturday)']

  return (
    <div className="tool-page cron-page">
      <div className="privacy-badge">
        All processing happens in your browser • No data is sent to server
      </div>
      <div className="tool-header">
        <h1> Online Cron Expression Parser and Generator Tool</h1>
        <p>Create and understand cron expressions effortlessly. Use interactive dropdowns to build scheduling expressions or paste existing cron syntax to see human-readable explanations. Essential for developers working with task schedulers, cronjobs, and automation systems.</p>
      </div>

      <div className="tool-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="cron-section">
          <h3>Build Cron Expression</h3>
          <div className="dropdown-grid">
            <div className="dropdown-group">
              <label htmlFor="minute">Minute</label>
              <select
                id="minute"
                value={minute}
                onChange={(e) => {
                  setMinute(e.target.value)
                  setOutput('')
                  setError('')
                }}
                className="cron-select"
              >
                {minuteOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '*' ? 'Every minute' : opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown-group">
              <label htmlFor="hour">Hour</label>
              <select
                id="hour"
                value={hour}
                onChange={(e) => {
                  setHour(e.target.value)
                  setOutput('')
                  setError('')
                }}
                className="cron-select"
              >
                {hourOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '*' ? 'Every hour' : opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown-group">
              <label htmlFor="day">Day of Month</label>
              <select
                id="day"
                value={day}
                onChange={(e) => {
                  setDay(e.target.value)
                  setOutput('')
                  setError('')
                }}
                className="cron-select"
              >
                {dayOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '*' ? 'Every day' : opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value)
                  setOutput('')
                  setError('')
                }}
                className="cron-select"
              >
                {monthOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '*' ? 'Every month' : opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown-group">
              <label htmlFor="weekday">Day of Week</label>
              <select
                id="weekday"
                value={weekday}
                onChange={(e) => {
                  const value = e.target.value.split(' ')[0]
                  setWeekday(value)
                  setOutput('')
                  setError('')
                }}
                className="cron-select"
              >
                {weekdayOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '*' ? 'Every day' : opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cron-actions">
            <button onClick={handleGenerateCron} className="cron-button cron-button--primary">
              Generate Cron Expression
            </button>
          </div>
        </div>

        <div className="divider">OR</div>

        <div className="cron-section">
          <h3>Parse Cron Expression</h3>
          <div className="textarea-group">
            <label htmlFor="rawCron">Raw Cron Expression (e.g., "0 3 * * *")</label>
            <textarea
              id="rawCron"
              value={rawCron}
              onChange={(e) => {
                setRawCron(e.target.value)
                setError('')
                setOutput('')
              }}
              placeholder="Enter a cron expression or paste one from your application..."
              className="textarea"
              rows="3"
            />
          </div>
          <div className="cron-actions">
            <button onClick={handleParseCron} className="cron-button cron-button--secondary">
              Parse Cron Expression
            </button>
          </div>
        </div>

        <div className="button-group cron-footer-actions">
          <button onClick={handleCopy} className="cron-button cron-button--primary">
            Copy Expression
          </button>
          <button onClick={handleClear} className="cron-button cron-button--ghost">
            Clear All
          </button>
        </div>

        {output && (
          <div className="cron-result">
            <h3>Result</h3>
            <div className="result-box">
              <p className="cron-expression">{rawCron || generateCronString()}</p>
              <p className="cron-description">{output}</p>
            </div>
          </div>
        )}

        <div className="info-box">
          <h4>About Cron Expressions</h4>
          <p>
            Cron is a time-based job scheduler used in Unix-like systems. A cron expression has 5 fields:
          </p>
          <ul>
            <li><strong>Minute (0-59):</strong> When to run within the hour</li>
            <li><strong>Hour (0-23):</strong> Which hour of the day</li>
            <li><strong>Day of Month (1-31):</strong> Which day of the month</li>
            <li><strong>Month (1-12):</strong> Which month of the year</li>
            <li><strong>Day of Week (0-6):</strong> Which day of the week (0=Sunday)</li>
          </ul>
          <p><strong>Special characters:</strong></p>
          <ul>
            <li><code>*</code> = any/every value</li>
            <li><code>,</code> = specific values (e.g., 1,3,5)</li>
            <li><code>-</code> = range (e.g., 1-5)</li>
            <li><code>/</code> = interval (e.g., */5 means every 5)</li>
          </ul>
          <p><strong>Common examples:</strong></p>
          <ul>
            <li><code>0 3 * * *</code> = Every day at 3:00 AM</li>
            <li><code>30 2 * * 0</code> = Every Sunday at 2:30 AM</li>
            <li><code>0 */4 * * *</code> = Every 4 hours</li>
            <li><code>0 0 1 * *</code> = First day of every month at midnight</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
