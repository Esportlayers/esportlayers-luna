import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const DraftPanelPage = dynamic(
    () => import('../components/pages/DraftPanelPage'),
    { ssr: false }
);

function DraftPanel(props): ReactElement {
    return <DraftPanelPage {...props} />
}

DraftPanel.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default DraftPanel;