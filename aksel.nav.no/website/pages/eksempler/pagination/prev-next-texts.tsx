import { Pagination } from "@navikt/ds-react";
import { withDsExample } from "components/website-modules/examples/withDsExample";
import { useState } from "react";

const Example = () => {
  const [pageState, setPageState] = useState(2);
  return (
    <Pagination
      page={pageState}
      onPageChange={(x) => setPageState(x)}
      count={9}
      boundaryCount={1}
      siblingCount={0}
      prevNextTexts
    />
  );
};

export default withDsExample(Example);

/* Storybook story */
export const Demo = {
  render: Example,
};

export const args = {
  index: 3,
};
