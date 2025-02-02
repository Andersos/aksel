import { StructureBuilder } from "sanity/desk";
import {
  bloggKategorier,
  grunnleggendeKategorier,
  komponentKategorier,
  landingsider,
  previews,
  prinsippKategorier,
} from "../../config";
import { Iframe } from "./IFrame";

import {
  ChatIcon,
  CircleSlashIcon,
  ComponentIcon,
  FileTextIcon,
  ImageIcon,
  LightBulbIcon,
  NewspaperIcon,
  PencilBoardIcon,
  TokenIcon,
} from "@navikt/aksel-icons";
import differenceInMonths from "date-fns/differenceInMonths";
import { FeedbackView } from "./FeedbackPreview";
import { FeedbackPanes } from "./feedback";
import { GodPraksisPanes } from "./god-praksis";
import { PanesWithCount } from "./with-count";

const isAfter = (date) => differenceInMonths(new Date(), new Date(date)) >= 6;

/* import { WebPreview, JsonView } from './previews' */
const filtered = [
  "ds_artikkel",
  "komponent_artikkel",
  "grunnleggende_landingsside",
  "komponenter_landingsside",
  "media.tag",
  "editor",
  "aksel_forside",
  "redirect",
  "token_kategori",
  "kode_eksempler_fil",
  "ds_props",
  "aksel_standalone",
  "aksel_blogg",
  "blogg_landingsside",
  "prinsipper_landingsside",
  "aksel_prinsipp",
  "aksel_tema",
  "godpraksis_landingsside",
  "aksel_artikkel",
  "skrivehjelp",
  "publication_flow",
  "aksel_feedback",
];

export const structure = async (
  S: StructureBuilder,
  { currentUser, getClient }
) => {
  const ids = await getClient({ apiVersion: "2021-06-07" })
    .fetch(`*[_type == "editor"]{
      _id,
      user_id
    }`);

  const editor = ids.find(({ user_id }) => user_id?.current === currentUser.id);
  const adminOrDev = currentUser.roles.find((x) =>
    ["developer", "administrator"].includes(x.name)
  );
  const developer = currentUser.roles.find((x) =>
    ["developer"].includes(x.name)
  );

  const feedback = await getClient({ apiVersion: "2021-06-07" }).fetch(
    `*[_type == "aksel_feedback" && $id in doc_ref->contributors[]->user_id.current]{_id, behandlet}`,
    { id: currentUser?.id }
  );

  let outdated = await getClient({ apiVersion: "2021-06-07" }).fetch(
    `*[$id in contributors[]->user_id.current]{_id, updateInfo}`,
    { id: currentUser?.id }
  );

  outdated = outdated.filter((x) => isAfter(x.updateInfo?.lastVerified));

  return S.list()
    .title("Innholdstyper")
    .items([
      ...(editor
        ? [S.documentListItem().schemaType(`editor`).id(editor._id)]
        : []),
      ...(outdated.length > 0
        ? [
            S.listItem()
              .title(
                `Utdaterte artikler (${
                  outdated.filter((x) => !x._id.includes("draft")).length
                })`
              )
              .child(
                S.documentList()
                  .title(`Utdaterte artikler`)
                  .filter(`_id in $ids`)
                  .params({
                    ids: outdated.map((x) => x?._id),
                  })
              ),
          ]
        : []),
      ...(feedback.length > 0
        ? [
            S.listItem()
              .title(
                `Tilbakemeldinger (${
                  feedback.filter(
                    (x) => !x._id.includes("draft") && x.behandlet === false
                  ).length
                })`
              )
              .icon(ChatIcon)
              .child(
                S.list()
                  .title("Tilbakemeldinger.")
                  .items([
                    S.listItem()
                      .title(
                        `Nye tilbakemeldinger (${
                          feedback.filter(
                            (x) =>
                              !x._id.includes("draft") && x.behandlet === false
                          ).length
                        })`
                      )
                      .child(
                        S.documentList()
                          .title(`Nye tilbakemeldinger`)
                          .filter(
                            `_type == 'aksel_feedback' && behandlet == false && _id in $ids`
                          )
                          .params({
                            ids: feedback.map((x) => x?._id),
                          })
                      ),
                    S.listItem()
                      .title(
                        `Ferdig behandlet (${
                          feedback.filter(
                            (x) =>
                              !x._id.includes("draft") && x.behandlet === true
                          ).length
                        })`
                      )
                      .child(
                        S.documentList()
                          .title("Ferdig")
                          .filter(
                            `_type == 'aksel_feedback' && behandlet == true && _id in $ids`
                          )
                          .params({
                            ids: feedback.map((x) => x?._id),
                          })
                      ),
                  ])
              ),
            S.divider(),
          ]
        : [S.divider()]),
      S.listItem()
        .title("God Praksis")
        .icon(PencilBoardIcon)
        .child(
          S.list()
            .title("God Praksis")
            .items([
              S.documentListItem()
                .title(`Landingsside`)
                .schemaType(`godpraksis_landingsside`)
                .id(`godpraksis_landingsside_id1`),
              S.divider(),
              ...(await GodPraksisPanes(getClient, S)),
            ])
        ),
      S.listItem()
        .title("Prinsipper")
        .icon(LightBulbIcon)
        .child(
          S.list()
            .title("Prinsipper")
            .items([
              S.documentListItem()
                .title(`Landingsside`)
                .schemaType(`prinsipper_landingsside`)
                .id(`prinsipper_landingsside_id1`),
              S.divider(),
              ...prinsippKategorier.map(({ value, title }) =>
                S.listItem().title(title).child(
                  S.documentList()
                    .title(title)
                    .filter(
                      `_type == 'aksel_prinsipp' && $value == prinsipp.prinsippvalg`
                    )
                    .params({ value })
                  /* .menuItems([
                        ...S.documentTypeList("aksel_prinsipp").getMenuItems(),
                      ]) */
                )
              ),
              S.listItem()
                .title("Alle artikler")
                .child(S.documentTypeList("aksel_prinsipp")),
            ])
        ),
      S.listItem()
        .title("Grunnleggende")
        .icon(TokenIcon)
        .child(
          S.list()
            .title("Grunnleggende")
            .items([
              S.documentListItem()
                .title(`Landingsside`)
                .schemaType(`grunnleggende_landingsside`)
                .id(`grunnleggende_landingsside_id1`),
              S.divider(),
              ...(await PanesWithCount(
                "ds_artikkel",
                grunnleggendeKategorier,
                getClient,
                S
              )),
            ])
        ),
      S.listItem()
        .title("Komponenter")
        .icon(ComponentIcon)
        .child(
          S.list()
            .title("Komponenter")
            .items([
              S.documentListItem()
                .title(`Landingsside`)
                .schemaType(`komponenter_landingsside`)
                .id(`komponenter_landingsside_id1`),
              S.divider(),
              ...(await PanesWithCount(
                "komponent_artikkel",
                komponentKategorier,
                getClient,
                S
              )),
            ])
        ),
      S.listItem()
        .title("Produktbloggen")
        .icon(NewspaperIcon)
        .child(
          S.list()
            .title("Produktbloggen")
            .items([
              S.documentListItem()
                .title(`Landingsside`)
                .schemaType(`blogg_landingsside`)
                .id(`blogg_landingsside_id1`),
              S.divider(),
              ...(await PanesWithCount(
                "aksel_blogg",
                [...bloggKategorier],
                getClient,
                S
              )),
            ])
        ),
      ...(adminOrDev
        ? [
            S.divider(),
            S.listItem()
              .title("Admin")
              .icon(CircleSlashIcon)
              .child(
                S.list()
                  .title("Admin")
                  .items([
                    S.documentListItem()
                      .title(`Forside`)
                      .schemaType(`aksel_forside`)
                      .icon(ImageIcon)
                      .id(`aksel_forside_dokument`),
                    S.listItem()
                      .title("Feedback")
                      .icon(ChatIcon)
                      .child(
                        S.list()
                          .title("Feedback")
                          .items([...(await FeedbackPanes(getClient, S))])
                      ),

                    S.listItem().title("Standalone-sider").child(
                      S.documentList()
                        .title("Sider")
                        .filter(`_type == 'aksel_standalone'`)
                      /* .menuItems([
                            ...S.documentTypeList(
                              "aksel_standalone"
                            ).getMenuItems(),
                          ]) */
                    ),
                    S.listItem().title("Forfattere").child(
                      S.documentList()
                        .title("Forfattere")
                        .filter(`_type == 'editor'`)
                      /* .menuItems([
                            ...S.documentTypeList("editor").getMenuItems(),
                          ]) */
                    ),
                    S.listItem().title("Redirects").child(
                      S.documentList()
                        .title("Redirects")
                        .filter(`_type == 'redirect'`)
                      /* .menuItems([
                            ...S.documentTypeList("redirect").getMenuItems(),
                          ]) */
                    ),
                    S.listItem()
                      .title("Komponent-eksempler Designsystemet")
                      .child(
                        S.documentList()
                          .title("Eksempler")
                          .filter(`_type == 'kode_eksempler_fil'`)
                      ),
                    S.listItem()
                      .title("Token-grupper Designsystemet")
                      .child(
                        S.documentList()
                          .title("Grupper")
                          .filter(`_type == 'token_kategori'`)
                      ),
                    S.listItem()
                      .title("Props Designsystemet")
                      .child(
                        S.documentList()
                          .title("Props")
                          .filter(`_type == 'ds_props'`)
                      ),
                    S.documentListItem()
                      .title(`Skrivehjelp`)
                      .schemaType(`skrivehjelp`)
                      .icon(FileTextIcon)
                      .id(`skrivehjelp`),
                    S.documentListItem()
                      .title(`Publiseringsflyt`)
                      .schemaType(`publication_flow`)
                      .icon(FileTextIcon)
                      .id(`publication_flow`),
                  ])
              ),
          ]
        : []),

      S.divider(),
      ...(developer
        ? S.documentTypeListItems().filter(
            (listItem) => !filtered.includes(listItem.getId())
          )
        : []),
    ]);
};

export const resolveProductionUrl = (doc) => {
  const basePath = "https://aksel.nav.no";
  const devPath = "http://localhost:3000";

  if (previews.includes(doc._type)) {
    const slug = doc.slug?.current;
    const previewUrl = `/preview/${slug}`;
    if (!slug) {
      return "";
    }
    return process.env.NODE_ENV === "production"
      ? `${basePath}${previewUrl}`
      : `${devPath}${previewUrl}`;
  }
  if (landingsider.find((x) => x.name === doc._type)) {
    const slug = landingsider.find((x) => x.name === doc._type).url;
    const previewUrl = `/preview/${slug}`;
    if (!slug) {
      return "";
    }
    return process.env.NODE_ENV === "production"
      ? `${basePath}${previewUrl}`
      : `${devPath}${previewUrl}`;
  }

  if ("aksel_tema" === doc._type) {
    const slug = doc.slug?.current;
    const previewUrl = `/preview/god-praksis/${slug}`;
    if (!slug) {
      return "";
    }
    return process.env.NODE_ENV === "production"
      ? `${basePath}${previewUrl}`
      : `${devPath}${previewUrl}`;
  }
};

export const defaultDocumentNode = (S, { schemaType }) => {
  if (
    [...previews, "aksel_tema", ...landingsider.map((x) => x.name)].includes(
      schemaType
    )
  ) {
    return S.document().views([
      S.view.form(),

      S.view
        .component(Iframe)
        .options({
          url: (doc) => resolveProductionUrl(doc),
        })
        .title("Forhåndsvisning"),
      S.view.component(FeedbackView).icon(ChatIcon).title("Tilbakemeldinger"),
    ]);
  }
  if (schemaType === "aksel_forside") {
    return S.document().views([S.view.form()]);
  }
  return S.document().views([S.view.form()]);
};
