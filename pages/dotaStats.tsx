import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const DotaStatsPage = dynamic(
    () => import('../components/pages/dotaStats'),
    { ssr: false }
);

function DotaStats(props): ReactElement {
    return <DotaStatsPage {...props} dynamicNumbers={false}/>
}

DotaStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default DotaStats;