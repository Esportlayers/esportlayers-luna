import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const TimerPage = dynamic(
    () => import('../../components/pages/voting/timer'),
    { ssr: false }
);

function Timer(props): ReactElement {
    return <TimerPage {...props} />
}

Timer.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Timer;