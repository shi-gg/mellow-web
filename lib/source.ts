import type { InferPageType } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";

export const docs = defineDocs({
    dir: "content/docs",
    docs: {
        schema: pageSchema.extend({
            permissions: z.object({
                bot: z.array(z.string()).optional(),
                user: z.array(z.string()).optional()
            }).optional()
        })
    }
});

export const legal = defineDocs({
    dir: "content/legal"
});

export const source = loader({
    baseUrl: "/docs",
    source: docs.toFumadocsSource()
});

export type Page = InferPageType<typeof source>;