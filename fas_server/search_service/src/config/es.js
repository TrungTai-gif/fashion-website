import { Client } from "@elastic/elasticsearch";

const ES_NODE = process.env.ELASTICSEARCH_NODE;
const ES_INDEX = process.env.ES_INDEX || "products";

export const esClient = new Client({ node: ES_NODE });

export async function ensureIndex() {
  try {
    const exists = await esClient.indices.exists({ index: ES_INDEX });
    if (!exists) {
      await esClient.indices.create({
        index: ES_INDEX,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
          analysis: {
            analyzer: {
              vietnamese_text: {
                type: "standard",
                stopwords: "_none_",
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: {
              type: "text",
              analyzer: "vietnamese_text",
              fields: { keyword: { type: "keyword" } },
            },
            slug: { type: "keyword" },
            image: { type: "keyword" },
            shortDescription: { type: "text", analyzer: "vietnamese_text" },
          },
        },
      });
    } else {
      console.log(`✓ Index '${ES_INDEX}' already exists`);
    }
  } catch (err) {
    console.error(
      "Failed ensuring index:",
      err?.meta?.body || err.message || err
    );
    throw err;
  }
}

export async function esClientInfo() {
  try {
    const info = await esClient.info();
    console.log("Elasticsearch info:", info?.meta?.name || info?.name || "ok");
  } catch (err) {
    console.error(
      "Failed to connect to Elasticsearch:",
      err?.meta?.body || err.message || err
    );
    throw err;
  }
}

export { ES_INDEX };
