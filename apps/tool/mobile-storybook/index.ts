import { registerRootComponent } from "expo";
import { Uniwind } from "uniwind";
import "./src/global.css";
import StorybookUIRoot from "./.rnstorybook";

Uniwind.setTheme("dark");

registerRootComponent(StorybookUIRoot);
