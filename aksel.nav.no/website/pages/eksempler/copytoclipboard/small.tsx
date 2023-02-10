import { CopyToClipboard } from "@navikt/ds-react-internal";
import { withDsExample } from "components/website-modules/examples/withDsExample";

const Example = () => {
  return (
    <CopyToClipboard size="small" copyText="3.14" popoverText="Kopierte PI">
      Kopier
    </CopyToClipboard>
  );
};

export default withDsExample(Example);

/* Storybook story */
export const Demo = {
  render: Example,
};

export const args = {
  index: 1,
};
