import { LinkIcon } from "@navikt/aksel-icons";
import { allArticleDocsRef } from "../../../config";

import React from "react";
import { defineField, defineType } from "sanity";

export const RelatertInnhold = defineType({
  name: "relatert_innhold",
  title: "Relaterte lenker",
  description: "Liste med relevante lenker til innholdet",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      title: "Tittel",
      description: "'Relevante lenker' brukes som default",
      name: "title",
      type: "string",
    }),
    defineField({
      title: "Lenker",
      name: "lenker",
      type: "array",
      validation: (Rule) =>
        Rule.required().max(10).error("Kan ha maks 10 lenker"),
      of: [
        {
          title: "Lenke",
          name: "lenke",
          type: "object",
          fields: [
            defineField({
              title: "Tittel",
              name: "title",
              type: "string",
              validation: (Rule) =>
                Rule.required()
                  .max(40)
                  .error("Tittelen kan være på maks 40 tegn"),
            }),
            defineField({
              title: "Intern side i Sanity",
              name: "intern",
              type: "boolean",
              options: {
                layout: "checkbox",
              },
              validation: (Rule) => Rule.required(),
              initialValue: false,
            }),
            defineField({
              title: "Lenke til Intern sanity-side",
              name: "intern_lenke",
              type: "reference",
              to: [...allArticleDocsRef],
              hidden: ({ parent }) => !parent?.intern,
            }),
            defineField({
              title: "Lenke til ekstern side",
              name: "ekstern_link",
              type: "url",
              hidden: ({ parent }) => parent?.intern,
            }),
            defineField({
              title: "Linker til et eksternt domene",
              description:
                "Sett denne hvis lenken går til en side utenfor aksel.nav.no",
              name: "ekstern_domene",
              type: "boolean",
              initialValue: false,
              hidden: ({ parent }) => parent?.intern,
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      links: "links",
    },
    prepare() {
      return { title: "Relatert innhold kort", media: () => <LinkIcon /> };
    },
  },
});
