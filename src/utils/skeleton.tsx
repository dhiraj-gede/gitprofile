export const skeleton = ({
  widthCls = null,
  heightCls = null,
  style = {} as React.CSSProperties,
  shape = 'rounded-full',
  className = null,
}: {
  widthCls?: string | null;
  heightCls?: string | null;
  style?: React.CSSProperties;
  shape?: string;
  className?: string | null;
}): JSX.Element => {
  const classNames = ['bg-base-300', 'animate-pulse', shape];
  if (className) {
    classNames.push(className);
  }
  if (widthCls) {
    classNames.push(widthCls);
  }
  if (heightCls) {
    classNames.push(heightCls);
  }

  return <div className={classNames.join(' ')} style={style} />;
};
