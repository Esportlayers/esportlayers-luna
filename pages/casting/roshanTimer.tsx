import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const RoshanTimerPage = dynamic(
    () => import('../../components/pages/casting/roshanTimer'),
    { ssr: false }
);

function RoshanTimer(props): ReactElement {
    return <RoshanTimerPage {...props} />
}

RoshanTimer.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default RoshanTimer;