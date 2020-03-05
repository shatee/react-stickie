export type StickyProps = {
  className?: string;
  top?: number;
  bottom?: number;
  onChange?: (isFloat: boolean) => void;
  children: React.ReactElement;
  ignorePositionSticky?: boolean;
};
