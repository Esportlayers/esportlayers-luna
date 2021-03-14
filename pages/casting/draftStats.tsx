import { ReactElement } from "react";
import dynamic from "next/dynamic";

function DraftStats(): ReactElement {
  return <h1>404 - Page Not Found</h1>;
}

DraftStats.getInitialProps = ({ query: { auth, testing } }) => {
  return { auth, testing: Boolean(testing) };
};

export default DraftStats;
