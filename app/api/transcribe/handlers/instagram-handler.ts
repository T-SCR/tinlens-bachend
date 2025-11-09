import { WebHandler } from "./web-handler";

/**
 * Instagram handler piggybacks on the web scraping pipeline but tags the platform
 * so analytics, logging, and downstream consumers know the difference.
 */
export class InstagramHandler extends WebHandler {
  constructor() {
    super("instagram");
  }
}
