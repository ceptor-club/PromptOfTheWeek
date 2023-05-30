require("dotenv").config()
const { ApifyClient } = require("apify-client")

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

// Prepare actor input
const input = {
  handle: ["CeptorClub"],
  mode: "own",
  tweetsDesired: 1,
  searchMode: "top",
  searchTerms: [],
  proxyConfig: {
    useApifyProxy: true,
  },
  extendOutputFunction: async ({ data, item, page, request, customData }) => {
    return item
  },
  extendScraperFunction: async ({
    page,
    request,
    addSearch,
    addProfile,
    _,
    addThread,
    addEvent,
    customData,
    signal,
    label,
  }) => {},
  customData: {},
  handlePageTimeoutSecs: 500,
  maxRequestRetries: 6,
  maxIdleTimeoutSecs: 60,
}

;(async () => {
  // Run the actor and wait for it to finish
  const run = await client.actor("quacker/twitter-scraper").call(input)

  // Fetch and print actor results from the run's dataset (if any)
  console.log("Results from dataset")
  const { items } = await client.dataset(run.defaultDatasetId).listItems()
  items.forEach((item) => {
    console.dir(item)
  })
})()
