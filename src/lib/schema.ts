/**
 * Schema.org JSON-LD builders.
 *
 * One canonical Person and WebSite, referenced by `@id` from every page-level
 * entity. Article/Breadcrumb/CollectionPage emit URL-stable `@id`s so future
 * entities can link in without duplicating the underlying nodes.
 *
 * Usage: pass the result of `schemaGraph([...])` to <Base jsonLd={...}>.
 */

export const SITE_URL = 'https://dennisberger.me';

// Stable @ids — fragment URIs so Google can dedupe across pages.
export const PERSON_ID = `${SITE_URL}/#dennis`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type Entity = Record<string, unknown>;

export function personEntity(): Entity {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Dennis Berger',
    url: SITE_URL,
    image: `${SITE_URL}/dennis.jpeg`,
    jobTitle: 'Design Operations Leader',
    worksFor: { '@type': 'Organization', name: 'Taco Bell' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Philadelphia',
      addressRegion: 'PA',
      addressCountry: 'US',
    },
    sameAs: ['https://linkedin.com/in/dennisberger'],
  };
}

export function websiteEntity(): Entity {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'Dennis Berger',
    description:
      'Design Operations and UX strategy leader based in Philadelphia.',
    publisher: { '@id': PERSON_ID },
    inLanguage: 'en-US',
  };
}

/** Profile pages (home, about) — links the page to the canonical Person. */
export function profilePageEntity(opts: {
  url: string;
  name: string;
  description?: string;
}): Entity {
  return {
    '@type': 'ProfilePage',
    '@id': `${opts.url}#profilepage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    mainEntity: { '@id': PERSON_ID },
  };
}

/** Case study Article. URL is the absolute URL of the case study. */
export function articleEntity(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished?: Date;
  dateModified?: Date;
  image: string; // absolute URL
}): Entity {
  const node: Entity = {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    url: opts.url,
    mainEntityOfPage: opts.url,
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
  };
  if (opts.datePublished) node.datePublished = opts.datePublished.toISOString();
  if (opts.dateModified) node.dateModified = opts.dateModified.toISOString();
  return node;
}

/** Listing pages (e.g. /work/). */
export function collectionPageEntity(opts: {
  url: string;
  name: string;
  description?: string;
}): Entity {
  return {
    '@type': 'CollectionPage',
    '@id': `${opts.url}#collectionpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function itemListEntity(items: { url: string; name: string }[]): Entity {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: it.url,
      name: it.name,
    })),
  };
}

/** Breadcrumb trail — items in order, root first. */
export function breadcrumbEntity(
  trail: { name: string; url: string }[],
): Entity {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}

/** Wrap one or more entities in a schema.org @graph document. */
export function schemaGraph(entities: Entity[]): Entity {
  return {
    '@context': 'https://schema.org',
    '@graph': entities,
  };
}
