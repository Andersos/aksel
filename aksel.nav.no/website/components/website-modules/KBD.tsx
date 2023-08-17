import cl from "clsx";

export const KBD = (props: React.HTMLAttributes<HTMLElement>) => (
  <kbd
    className={cl(
      "mx-05 ring-border-subtle my-0 inline-block min-w-[2rem] rounded-md px-2 py-[1px] text-center font-mono text-sm text-gray-900 ring-1 ring-inset",
      "from-surface-default via-surface-default to-surface-neutral-subtle bg-gradient-to-b",
      "group-active:text-text-on-inverted group-active:ring-grayalpha-400 group-active:from-gray-700 group-active:via-gray-700 group-active:to-gray-900"
    )}
  >
    <span className="kbd">{props.children}</span>
    <style jsx>{`
      .kbd {
        text-shadow: 0 1px 0px var(--a-grayalpha-200);
      }
    `}</style>
  </kbd>
);