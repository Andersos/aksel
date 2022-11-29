import { People } from "@navikt/ds-icons";
import React from "react";
import { defineType, defineField } from "sanity";

export const Editors = defineType({
  title: "Forfattere",
  name: "editor",
  type: "document",
  fields: [
    defineField({
      title: "Navn",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("Må legge til navn"),
    }),
    defineField({
      title: "Sanity bruker-id (dev only)",
      name: "user_id",
      type: "slug",
      validation: (Rule) => Rule.required().error("Må ha Id"),
      options: {
        source: (_, { currentUser }) => {
          return currentUser.id;
        },
        slugify: (input) => input,
      },
      readOnly: true,
      hidden: ({ currentUser }) =>
        !currentUser.roles.find((x) => x.name === "developer"),
    }),
    defineField({
      title: "Roller",
      description: "eks: Utvikler, Webanalytiker, uu-spesialist",
      name: "roller",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    /* defineField({
      name: "profile_page",
      type: "string",
      title: "Profil",
      inputComponent: profilePage,
      hidden: ({ currentUser, parent }) => {
        const { id, roles } = currentUser;
        return (
          !roles.find(({ name }) => name === "administrator") &&
          parent?.user_id?.current !== id
        );
      },
    }), */
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title,
        subtitle: "Min profilside",
        media: () => <People />,
      };
    },
  },
});
