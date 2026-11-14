export const AUTHOR_SLUG = 'amir-ariff';

export const AUTHOR_IMAGE_PATH = '/images/penulis/amir-ariff-colour-480.webp';
export const EDITORIAL_POLICY_URL = 'https://insurans.co/kaedah-editorial/';
export const CORRECTIONS_POLICY_URL = 'https://insurans.co/kaedah-editorial/#pembetulan';

export const EDITORIAL_AUTHOR = {
  "@type": "Person",
  "@id": "https://insurans.co/penulis/amir-ariff/#person",
  "name": "Amir Ariff",
  "jobTitle": "Pengasas & Editor",
  "url": "https://insurans.co/penulis/amir-ariff/",
  "image": `https://insurans.co${AUTHOR_IMAGE_PATH}`,
  "sameAs": ["https://www.linkedin.com/in/amirariff"],
  "worksFor": {
    "@type": "Organization",
    "name": "Insurans.co",
    "url": "https://insurans.co"
  }
} as const;

export const PUBLISHER = {
  "@type": "Organization",
  "name": "Insurans.co",
  "url": "https://insurans.co",
  "publishingPrinciples": EDITORIAL_POLICY_URL,
  "correctionsPolicy": CORRECTIONS_POLICY_URL
} as const;

function transformSchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(transformSchema);
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  const schema = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key, transformSchema(nestedValue)])
  ) as Record<string, unknown>;

  // Every Insurans.co Organization node points to the editorial and corrections policy.
  if (schema['@type'] === 'Organization' && schema.url === PUBLISHER.url) {
    if (!('publishingPrinciples' in schema)) schema.publishingPrinciples = EDITORIAL_POLICY_URL;
    if (!('correctionsPolicy' in schema)) schema.correctionsPolicy = CORRECTIONS_POLICY_URL;
  }

  if (schema['@type'] === 'Article') {
    const existing = schema.author as { '@type'?: string } | undefined;
    // Keep a real Person author; replace a missing or bare Organization author with the editorial Person.
    if (!existing || existing['@type'] !== 'Person') schema.author = EDITORIAL_AUTHOR;
    if (!('publisher' in schema)) schema.publisher = PUBLISHER;
  }

  return schema;
}

export function withAuthor<T extends object>(schema: T): T {
  return transformSchema(schema) as T;
}
