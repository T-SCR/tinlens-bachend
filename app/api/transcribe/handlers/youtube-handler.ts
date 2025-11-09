import { WebHandler } from "./web-handler";

/**
 * YouTube handler relies on the same structured scraping and fact-checking
 * pipeline used for generic web content, but sets the platform to "youtube"
 * for logging, analytics, and future specialization.
 */
export class YouTubeHandler extends WebHandler {
  constructor() {
    super("youtube");
  }
}
