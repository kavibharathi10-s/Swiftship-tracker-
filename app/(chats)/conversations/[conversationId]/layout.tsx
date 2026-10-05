import { Metadata } from "next";
import React from "react";

type Props = React.PropsWithChildren<{}>;

export const metadata: Metadata = {
  title: "Ship Swift | Conversation",
  description: "Courier Freelancing",
};

const Layout = ({ children }: Props) => {
  return <>{children}</>;
};

export default Layout;
