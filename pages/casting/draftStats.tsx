import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const DraftStatsPage = dynamic(
    () => import('../../components/pages/casting/draftStats'),
    { ssr: false }
);

function DraftStats(props): ReactElement {
    return <DraftStatsPage {...props} />
}

DraftStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default DraftStats;