import { Link } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { Button } from '../Button';
import { v4 } from 'uuid';
import { GroupButton } from '../../types';

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
        <Link key={v4()} href={href}>
          <Button color="primary" {...props}>
            {children}
          </Button>
        </Link>
      );
    }

    return (
      <Button key={v4()} color="primary" {...props}>
        {children}
      </Button>
    );
  };

  return (
    <div className="flex flex-1 justify-between">
      <div className="flex gap-2">{leftButtons?.map(renderButton)}</div>
      <div className="flex gap-2">{rightButtons?.map(renderButton)}</div>
    </div>
  );
});
