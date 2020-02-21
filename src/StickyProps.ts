export type StickyProps = {
  top?: number;
  bottom?: number;
  onChange?: (isFloat: boolean) => void;
  children: React.ReactElement;
  ignorePositionSticky?: boolean;
};
