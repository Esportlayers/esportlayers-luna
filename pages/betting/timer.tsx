import { ReactElement } from "react";
import dynamic from "next/dynamic";
import TimerFrame from "../../components/betting/Timer/TimerFrame";

const BetContext = dynamic(
    () => import('../../components/betting/Context'),
    { ssr: false }
);

function Timer({auth, testing}: {auth: string; testing: boolean}): ReactElement {
    return <BetContext auth={auth}>
        <TimerFrame auth={auth} testing={testing}/>
    </BetContext>;
}

Timer.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Timer;