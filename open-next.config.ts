import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// Default setup: no incremental cache. The site has no ISR pages, and the weather route sets its own
// Cache-Control header. To add caching later, see https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({})
