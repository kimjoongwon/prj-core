import { CalendarInputProps } from "@shared/types";
import { observer } from "mobx-react-lite";
import { useProps } from "./_hooks/useProps";
import { CalendarInputView } from "./CalendarInputView";

export const CalendarInput = observer(<T extends object>(props: CalendarInputProps<T>) => {
  const { state } = useProps(props);

  return (
    <div>
      <CalendarInputView state={state} />
    </div>
  );
});
