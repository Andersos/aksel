import { Show, HGrid } from "@navikt/ds-react";
import { withDsExample } from "components/website-modules/examples/withDsExample";
import cl from "clsx";

const Example = () => {
  return (
    <HGrid columns={{ xs: 1, md: 2 }} gap="4">
      <Placeholder text="Alltid synlig" />
      <Show above="md">
        <Placeholder desktop text="Synlig bare på desktop" />
      </Show>
    </HGrid>
  );
};

export default withDsExample(Example, { showBreakpoints: true });

/* Storybook story */
export const Demo = {
  render: Example,
};

export const args = {
  index: 0,
  desc: "Endre størrelse på nettleservindu for å se komponent i aksjon",
};

const Placeholder = ({
  text,
  noPadding,
  mobil,
  desktop,
}: {
  text?: string;
  noPadding?: boolean;
  mobil?: boolean;
  desktop?: boolean;
}) => {
  return (
    <div
      className={cl(
        "min-h-24 text-text-on-action grid aspect-video h-auto w-auto place-content-center rounded p-2",
        {
          "bg-pink-600": mobil,
          "bg-violet-600": desktop,
          "bg-teal-600": !desktop && !mobil,
        }
      )}
      style={{ padding: noPadding && 0 }}
    >
      {text}
    </div>
  );
};