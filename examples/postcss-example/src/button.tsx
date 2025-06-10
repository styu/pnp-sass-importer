import React from "react";
import * as css from "./button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button className={css.button}>{children}</button>;
};
