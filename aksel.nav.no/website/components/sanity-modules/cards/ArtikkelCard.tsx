import { withErrorBoundary } from "@/error-boundary";

import { amplitudeLogNavigation } from "@/logging";
import {
  AkselGodPraksisDocT,
  ResolveContributorsSingleT,
  ResolveSlugT,
  ResolveTemaT,
} from "@/types";
import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import { useFormatedDate } from "components/website-modules/utils/getDate";
import NextLink from "next/link";
import { abbrName } from "../..";

const ArtikkelCard = ({
  slug,
  source,
  heading,
  ingress,
  contributor,
  _updatedAt,
  publishedAt,
  variant = "god-praksis",
  tema,
  level = "2",
  ...rest
}: ResolveContributorsSingleT<
  ResolveTemaT<ResolveSlugT<AkselGodPraksisDocT>>
> & { source?: string; variant: string; level?: "2" | "3" }) => {
  const date = useFormatedDate(
    (rest as any)?.updateInfo?.lastVerified ?? publishedAt ?? _updatedAt
  );

  return (
    <div className="shadow-xsmall hover:shadow-small focus-within:ring-border-focus bg-surface-default group relative rounded-lg p-3 pb-16 focus-within:ring-[3px] sm:p-5 sm:pb-16">
      <NextLink
        href={{
          pathname: `/${slug}`,
          query: {
            ...(source ? { tema: source } : {}),
          },
        }}
        passHref
        className="after:absolute after:inset-0 after:z-10 after:rounded-lg focus:outline-none"
        onClick={(e) =>
          amplitudeLogNavigation(
            "artikkel-kort",
            e.currentTarget.getAttribute("href")
          )
        }
      >
        <Heading
          level={level}
          size="small"
          className="text-deepblue-700 underline group-hover:no-underline"
        >
          {heading}
        </Heading>
      </NextLink>
      {ingress && <BodyShort className="mt-2">{ingress}</BodyShort>}
      {variant === "god-praksis" ? (
        <span className="absolute bottom-5 flex gap-2">
          {contributor && (
            <Detail as="span">{abbrName(contributor.title)}</Detail>
          )}
          {contributor && (
            <Detail as="span" className="text-text-subtle">
              —
            </Detail>
          )}
          <Detail as="span" className="text-text-subtle">
            {date}
          </Detail>
        </span>
      ) : (
        <>
          {tema?.[0] && (
            <Detail
              as="span"
              uppercase
              className="text-text-subtle absolute bottom-5"
            >
              {tema[0]}
            </Detail>
          )}
        </>
      )}
    </div>
  );
};

export default withErrorBoundary(ArtikkelCard, "ArtikkelCard");
