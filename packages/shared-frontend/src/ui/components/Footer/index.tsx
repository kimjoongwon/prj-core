type FooterProps = {
  children: React.ReactNode;
  className?: string;
};

export const Footer = (props: FooterProps) => {
  return (
    <footer className={props.className}>{props.children}</footer>
  );
};
