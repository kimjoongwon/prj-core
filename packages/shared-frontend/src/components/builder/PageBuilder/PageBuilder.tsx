import { observer } from "mobx-react-lite";
import { PageBuilder as PageBuilderInterface } from "@shared/types";
import { v4 } from "uuid";
import { ElementBuilder } from "../ElementBuilder";

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;

  return (
    <>
      {pageBuilder?.elements?.map((element) => {
        return <ElementBuilder key={v4()} elementBuilder={element} />;
      })}
    </>
  );
});

PageBuilder.displayName = "PageBuilder";
