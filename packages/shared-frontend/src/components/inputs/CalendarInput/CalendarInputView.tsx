import { CalendarInputPropsView } from "@shared/types";
import { observer } from "mobx-react-lite";
import { Dates } from "./Dates";
import { DaysOfWeek } from "./DaysOfWeek";
import { Header } from "./Header";

export const CalendarInputView = observer((props: CalendarInputPropsView) => {
  const { state } = props;

  return (
    <div className="w-full">
      <Header state={state} />
      <div className="grid grid-cols-7 grid-rows-7 gap-1">
        <DaysOfWeek />
        <Dates state={state} />
      </div>
    </div>
  );
});
