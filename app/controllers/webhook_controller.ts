import type { HttpContext } from "@adonisjs/core/http";
import drive from "@adonisjs/drive/services/main";
import { errors } from "@vinejs/vine";
import env from "#start/env";
import { setWebhookValidator } from "#validators/webhook_validator";

export default class WebhookController {
	/**
	 * Handle webhook requests and store data to the configured S3 bucket
	 */
	async set({ request, response }: HttpContext) {
		try {
			// Validate request using VineJS
			const payload = await setWebhookValidator.validate(request.all());

			// Get the disk name from environment variable
			const diskName = env.get("DRIVE_DISK");

			// Process file or string data
			if (payload.dataFile) {
				// Handle uploaded file using moveToDisk helper
				await payload.dataFile.moveToDisk(payload.path, diskName);
			} else if (payload.dataString) {
				// Handle string data
				const contentToStore =
					typeof payload.dataString === "string"
						? payload.dataString
						: JSON.stringify(payload.dataString);

				// Store string data to the S3 bucket
				await drive.use(diskName).put(payload.path, contentToStore);
			} else {
				// This shouldn't happen due to validation, but added for safety
				throw new Error("No data provided");
			}

			return response.status(200).json({
				status: "success",
				message: "Data stored successfully",
				path: payload.path,
			});
		} catch (error) {
			// Handle VineJS validation errors
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return response.status(422).json({
					status: "error",
					message: "Validation failed",
					errors: error.messages,
				});
			}

			// Handle other errors
			console.error("Error storing data:", error);
			return response.status(500).json({
				status: "error",
				message: "Failed to store data",
				error: error.message,
			});
		}
	}
}
