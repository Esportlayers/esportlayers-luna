import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const HeroStatsPage = dynamic(
    () => import('../../components/pages/casting/playerCompareStats'),
    { ssr: false }
);

function PlayerCompareStats(props): ReactElement {
    return <HeroStatsPage {...props} />
}

PlayerCompareStats.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default PlayerCompareStats;