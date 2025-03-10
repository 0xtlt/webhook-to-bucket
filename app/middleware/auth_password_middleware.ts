import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

/**
 * Middleware to validate webhook access using a password in headers
 */
export default class AuthPasswordMiddleware {
  /**
   * Handle the incoming request
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    
    // Get the configured password from environment
    const configuredPassword = env.get('PASSWORD')
    
    // Skip password check if not configured
    if (!configuredPassword) {
      console.warn('WARNING: No PASSWORD environment variable set. Webhook endpoint is unprotected!')
      return next()
    }
    
    // Get the password from the request header
    const providedPassword = request.header('X-Webhook-Password')
    
    // Verify the password
    if (!providedPassword || providedPassword !== configuredPassword) {
      return response.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid or missing password',
      })
    }
    
    // Password is valid, proceed to the next middleware or controller
    await next()
  }
}
