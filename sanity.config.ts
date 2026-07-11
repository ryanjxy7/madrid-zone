/**
 * Sanity Studio configuration — embedded in the Next.js app at /studio
 * (see src/app/studio/[[...tool]]/page.tsx). Editors never touch this
 * file; it only needs to change if the content model itself changes.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "madrid-zone",
  title: "Madrid Zone",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure })],
  document: {
    // Singletons (Site Settings, Next Match, League Table, Season Stats)
    // can only ever be edited, never duplicated or deleted by accident.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : input,
  },
  apiVersion,
});
