# MealCart Backend Logging System

This document explains the comprehensive logging system implemented in the MealCart backend.

## Overview

The logging system provides detailed insights into:
- User authentication (login/signup)
- Recipe generation activities
- Device and browser detection
- API request tracking
- Error monitoring
- Database operations
- System events

## Features

### 🔍 **Comprehensive Activity Tracking**
- User login/logout events
- Registration attempts and successes
- Recipe generation requests
- Recipe saving activities
- API endpoint usage

### 📱 **Device & Browser Detection**
- Automatic detection of mobile vs desktop devices
- Browser identification (Chrome, Firefox, Safari, Edge)
- Operating system detection
- IP address logging

### 🎨 **Color-Coded Console Output**
- ERROR: Red
- WARN: Yellow  
- INFO: Green
- DEBUG: Blue
- TRACE: Magenta

### 📄 **File Logging**
- Daily log files: `logs/app-YYYY-MM-DD.log`
- Structured JSON metadata
- Configurable log levels
- Optional file output

## Configuration

### Environment Variables

```bash
# Log level: ERROR, WARN, INFO, DEBUG, TRACE
LOG_LEVEL=INFO

# Enable/disable file logging
ENABLE_FILE_LOGGING=true
```

### Log Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| `ERROR` | Critical errors only | Production |
| `WARN` | Warnings and errors | Production |
| `INFO` | General information | Default |
| `DEBUG` | Development debugging | Development |
| `TRACE` | Detailed request traces | Development/Debugging |

## Usage

### Starting the Server with Logging

```bash
# Standard development
npm run dev

# Debug mode (detailed logs)
npm run dev:debug

# Trace mode (maximum detail)
npm run dev:trace
```

### Viewing Logs

#### Real-time Log Monitoring
```bash
# Backend logs only
cd backend && ./view-logs.sh

# Full stack dashboard
./show-logs.sh

# Follow logs in real-time
./show-logs.sh --follow
```

#### Manual Log Commands
```bash
# Today's logs
npm run logs

# Watch logs (requires 'watch' command)
npm run logs:watch

# Raw file access
tail -f backend/logs/app-$(date +%Y-%m-%d).log
```

## Log Examples

### User Authentication
```json
[2025-01-19 10:30:15] INFO: User Activity: LOGIN_SUCCESS
Metadata: {
  "action": "LOGIN_SUCCESS",
  "userId": "60f7b8d4c4d1234567890abc",
  "device": "Desktop - Chrome",
  "browser": "Google Chrome",
  "ip": "192.168.1.100",
  "username": "john_doe",
  "email": "j***@example.com",
  "processingTime": "245ms"
}
```

### Recipe Generation
```json
[2025-01-19 10:35:22] INFO: Recipe Generated
Metadata: {
  "userId": "60f7b8d4c4d1234567890abc",
  "device": "iPhone",
  "processingTime": "3200ms",
  "recipeTitle": "Spicy Chicken Tacos",
  "ingredients": 6,
  "cookingTime": 25,
  "difficulty": "medium"
}
```

### API Requests
```json
[2025-01-19 10:31:05] INFO: API Request: POST /api/auth/login
Metadata: {
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "responseTime": "245ms",
  "device": "Desktop - Chrome",
  "ip": "192.168.1.100"
}
```

### Error Tracking
```json
[2025-01-19 10:40:15] ERROR: Application Error: Recipe generation failed
Metadata: {
  "error": "AI API rate limit exceeded",
  "stack": "Error: AI API rate limit exceeded...",
  "method": "POST",
  "url": "/api/ai/generate-recipe",
  "device": "Desktop - Chrome",
  "userId": "60f7b8d4c4d1234567890abc"
}
```

## Log File Structure

### Directory Layout
```
backend/
├── logs/
│   ├── app-2025-01-19.log
│   ├── app-2025-01-18.log
│   └── app-2025-01-17.log
├── utils/
│   └── logger.js
├── middleware/
│   └── logging.js
└── view-logs.sh
```

### Log File Format
Each log entry contains:
- **Timestamp**: ISO format
- **Level**: ERROR, WARN, INFO, DEBUG, TRACE
- **Message**: Human-readable description
- **Metadata**: Structured JSON data

## Development vs Production

### Development Settings
```bash
LOG_LEVEL=DEBUG
ENABLE_FILE_LOGGING=true
```
- Detailed debugging information
- All request traces
- File and console output
- Device/browser detection

### Production Settings
```bash
LOG_LEVEL=WARN
ENABLE_FILE_LOGGING=false
```
- Errors and warnings only
- Console output only
- Minimal performance impact
- Security-conscious (less data logged)

## Security Considerations

### Data Privacy
- Email addresses are masked: `j***@example.com`
- Passwords are never logged
- Sensitive data is filtered
- IP addresses can be disabled

### Log Rotation
- Daily log files prevent unlimited growth
- Old logs should be archived/deleted
- Consider log aggregation services for production

## Monitoring & Alerts

### Key Metrics to Monitor
- Error rates (ERROR level logs)
- Authentication failures
- Recipe generation success rates
- API response times
- Device/browser trends

### Suggested Alerts
- High error rates (> 5% of requests)
- Authentication failures (potential attacks)
- AI API failures
- Database connection issues

## Troubleshooting

### Common Issues

**No logs appearing:**
```bash
# Check if logging is enabled
grep ENABLE_FILE_LOGGING .env

# Check log directory permissions
ls -la logs/

# Verify log level
grep LOG_LEVEL .env
```

**Log files too large:**
```bash
# Check file sizes
du -h logs/

# Archive old logs
mv logs/app-2025-01-*.log archive/
```

**Performance impact:**
- Set `LOG_LEVEL=WARN` for production
- Disable `ENABLE_FILE_LOGGING=false`
- Use log aggregation services

## Integration

### Log Aggregation Services
Compatible with:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **DataDog**
- **New Relic**
- **CloudWatch** (AWS)

### Custom Middleware
```javascript
const { logger } = require('./utils/logger');

// Custom logging middleware
app.use((req, res, next) => {
  logger.logUserActivity('CUSTOM_EVENT', req, userId, {
    customData: 'value'
  });
  next();
});
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with INFO logging |
| `npm run dev:debug` | Start with DEBUG logging |
| `npm run dev:trace` | Start with TRACE logging |
| `npm run logs` | View today's logs |
| `./view-logs.sh` | Real-time backend log viewer |
| `./show-logs.sh` | Full stack log dashboard |
| `./show-logs.sh -f` | Follow logs in real-time |

---

For more information, see the main project README or contact the development team.
