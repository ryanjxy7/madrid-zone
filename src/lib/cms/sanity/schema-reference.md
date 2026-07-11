# Sanity schema reference

Not a runtime file — a spec for the document types `src/lib/cms/sanity/queries.ts`
expects once a real Sanity Studio is connected. Create these as schema types
in your Studio (`sanity init`) with field names matching exactly.

## `article`
| field | type | notes |
|---|---|---|
| title | string | |
| slug | slug | source: title |
| dek | text | one-sentence standfirst |
| category | string | one of the `ArticleCategory` values in `src/types/content.ts` |
| tags | array of string | |
| isExclusive | boolean | optional |
| mainImage | image | with `alt` field and hotspot enabled |
| author | reference -> `author` | |
| publishedAt | datetime | |
| readingTime | string | e.g. "6 min read" |
| body | array of objects `{ type: "paragraph" \| "quote", text: text }` | keep simple until portable text is needed |

## `author`
| field | type |
|---|---|
| name | string |
| slug | slug |

## `sponsor`
| field | type |
|---|---|
| name | string |
| tag | string |
| order | number |

## `wireItem`
| field | type |
|---|---|
| time | string |
| text | string |

Once the Studio exists, set `SANITY_PROJECT_ID` and `SANITY_DATASET` in
`.env.local` — `src/lib/data/*.ts` will start reading from Sanity
automatically with no further code changes.
