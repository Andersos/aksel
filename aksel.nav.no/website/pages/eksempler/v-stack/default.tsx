import { VStack } from "@navikt/ds-react";
import { withDsExample } from "components/website-modules/examples/withDsExample";

const Example = () => {
  return (
    <VStack gap="4">
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </VStack>
  );
};

export default withDsExample(Example, { showBreakpoints: true });

/* Storybook story */
export const Demo = {
  render: Example,
};

export const args = {
  index: 0,
  desc: "VStack er en enkel layout-komponent for flexbox med flex-direction: column.",
};

const Placeholder = () => {
  return <div className="aspect-square h-12 rounded bg-teal-500" />;
};
