import { ButtonProps, Link, LinkProps } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { Button } from '../Button';
interface GroupButton extends ButtonProps {
  href: LinkProps['href'];
}

interface ButtonGroupProps {
  leftButtons?: GroupButton[];
  rightButtons?: GroupButton[];
}

export const ButtonGroup = observer((props: ButtonGroupProps) => {
  const { leftButtons, rightButtons } = props;

  const renderButton = (props: GroupButton) => {
    const { children, href } = props;

    if (href) {
      return (
        <Link href={href}>
          <Button color="primary" {...props}>
            {children}
          </Button>
        </Link>
      );
    }

    return (
      <Button color="primary" {...props}>
        {children}
      </Button>
    );
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">{leftButtons?.map(renderButton)}</div>
      <div className="flex gap-2">{rightButtons?.map(renderButton)}</div>
    </div>
  );
});
