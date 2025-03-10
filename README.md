# Webhook to Bucket

A lightweight AdonisJS application that provides a webhook endpoint to store data directly to any S3-compatible storage service.

## Features

- Simple API endpoint `/set` to store data to S3 buckets
- Password-based authentication to prevent unauthorized access
- Accepts both string data and file uploads
- Compatible with any S3-compatible storage service (AWS S3, DigitalOcean Spaces, MinIO, etc.)
- Docker ready for easy deployment
- Configurable via environment variables

## Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- S3-compatible storage service credentials

## Installation

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/webhook-to-bucket.git
   cd webhook-to-bucket
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your S3 credentials and webhook password:
   ```
   DRIVE_DISK=spaces
   SPACES_KEY=your_access_key_id
   SPACES_SECRET=your_secret_access_key
   SPACES_REGION=your_region
   SPACES_BUCKET=your_bucket_name
   SPACES_ENDPOINT=https://your_region.digitaloceanspaces.com
   APP_PASSWORD=your_secure_webhook_password
   ```

5. Start the development server:
   ```bash
   node ace serve --watch
   ```

### Docker Deployment

1. Configure your environment variables in `.env` as described above

2. Build and start the Docker container:
   ```bash
   docker-compose up -d
   ```

## Usage

Send a POST request to the `/set` endpoint with the following parameters and the authentication header:

### Required Header

- `X-Webhook-Password`: The password defined in your `.env` file for authentication

### Required Parameters

- `path`: The file path where the data should be stored in the bucket

### Data Parameters (one of the following is required)

- `dataString`: String or JSON content to store
- `dataFile`: A file upload (using multipart/form-data)

### Example using cURL (string data)

```bash
curl -X POST http://localhost:3333/set \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Password: your_secure_webhook_password" \
  -d '{"path": "example/file.json", "dataString": {"message": "Hello, world!"}}'
```

### Example using cURL (file upload)

```bash
curl -X POST http://localhost:3333/set \
  -H "X-Webhook-Password: your_secure_webhook_password" \
  -F "path=example/uploaded/image.jpg" \
  -F "dataFile=@/path/to/local/image.jpg"
```

### Example using JavaScript (string data)

```javascript
fetch('http://localhost:3333/set', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Password': 'your_secure_webhook_password'
  },
  body: JSON.stringify({
    path: 'example/file.json',
    dataString: { message: 'Hello, world!' }
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Example using JavaScript (file upload)

```javascript
const formData = new FormData();
formData.append('path', 'example/uploaded/image.jpg');
formData.append('dataFile', fileInput.files[0]); // Assuming fileInput is an input element of type="file"

fetch('http://localhost:3333/set', {
  method: 'POST',
  headers: {
    'X-Webhook-Password': 'your_secure_webhook_password'
  },
  body: formData,
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## API Response

A successful API response will look like:

```json
{
  "status": "success",
  "message": "Data stored successfully",
  "path": "example/file.json"
}
```

Error responses (401 for authentication failure, 422 for validation errors):

```json
{
  "status": "error",
  "message": "Unauthorized: Invalid or missing password"
}
```

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "path": ["The path field is required"],
    "dataString": ["Either dataString or dataFile must be provided"]
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3333` |
| `HOST` | Host to run the server on | `localhost` |
| `NODE_ENV` | Node environment | `development` |
| `DRIVE_DISK` | Default storage disk to use | `spaces` |
| `SPACES_KEY` | S3 access key ID | - |
| `SPACES_SECRET` | S3 secret access key | - |
| `SPACES_REGION` | S3 region | - |
| `SPACES_BUCKET` | S3 bucket name | - |
| `SPACES_ENDPOINT` | S3 endpoint URL | - |
| `APP_PASSWORD` | Password for webhook authentication | - |

## Security Considerations

- Always use a strong, unique password for the `APP_PASSWORD` environment variable
- Consider using HTTPS in production to encrypt the password sent in headers
- If deploying publicly, consider implementing rate limiting to prevent brute force attacks

## License

MIT
