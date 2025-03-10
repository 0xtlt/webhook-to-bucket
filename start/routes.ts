/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import WebhookController from '#controllers/webhook_controller'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return { status: 'ok' }
})

router.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() }
})

// Webhook endpoint to store data to S3 bucket with password protection
router
  .post('/set', [WebhookController, 'set'])
  .use(middleware.auth())
