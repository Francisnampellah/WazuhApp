# Node.js Application with Winston Logging

A minimal Node.js server built with TypeScript and Winston logging that generates JSON logs compatible with external log collectors like Wazuh.

## Features

- **Express HTTP Server**: Real web server with multiple endpoints
- **Winston Logging**: JSON format logs written to `/var/log/nodeapp.log`
- **TypeScript**: Full TypeScript support with proper types
- **Request/Response Logging**: Comprehensive HTTP request logging
- **Error Handling**: Proper error logging and graceful shutdown
- **Health Check**: `/health` endpoint for monitoring
- **Test Endpoints**: Various endpoints to test different log levels

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /` - Main endpoint with application info
- `GET /health` - Health check endpoint
- `GET /test-logs` - Test endpoint that generates logs at different levels

## Logging

The application logs to:
- **File**: `/var/log/nodeapp.log` (JSON format)
- **Console**: Colored output for development

### Log Format

Logs are in JSON format compatible with Wazuh and other log collectors:

```json
{
  "level": "info",
  "message": "Application started",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "appName": "NodeApp",
  "appVersion": "1.0.0",
  "port": 3000,
  "environment": "development",
  "pid": 12345
}
```

### Log Levels

- `debug` - Detailed debugging information
- `info` - General application information
- `warn` - Warning messages
- `error` - Error messages with stack traces

## File Structure

```
├── src/
│   ├── app.ts      # Main Express server
│   └── logger.ts   # Winston logger configuration
├── dist/           # Compiled JavaScript (generated)
├── package.json    # Dependencies and scripts
├── tsconfig.json   # TypeScript configuration
└── README.md       # This file
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: development)

## Testing the Logging

1. Start the server: `npm start`
2. Visit endpoints to generate logs:
   - `http://localhost:3000/` - Basic info logs
   - `http://localhost:3000/test-logs` - Different log levels
   - `http://localhost:3000/health` - Health check
3. Check logs: `tail -f /var/log/nodeapp.log`

## Wazuh Integration

The JSON log format is compatible with Wazuh. Configure Wazuh to monitor `/var/log/nodeapp.log` for log collection and analysis.

## Development

- `npm run dev` - Start with ts-node for development
- `npm run watch` - Watch mode for TypeScript compilation
- `npm run build` - Build for production # WazuhApp
