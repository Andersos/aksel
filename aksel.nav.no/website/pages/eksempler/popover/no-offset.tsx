import { Button, Popover } from "@navikt/ds-react";
import { withDsExample } from "components/website-modules/examples/withDsExample";
import { useRef, useState } from "react";

const Example = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openState, setOpenState] = useState(false);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
      >
        Åpne popover
      </Button>

      <Popover
        open={openState}
        onClose={() => setOpenState(false)}
        anchorEl={buttonRef.current}
        offset={0}
        arrow={false}
        placement="bottom"
      >
        <Popover.Content>offset = 0</Popover.Content>
      </Popover>
    </>
  );
};

export default withDsExample(Example);

/* Storybook story */
export const Demo = {
  render: Example,
};

export const args = {
  index: 2,
};
