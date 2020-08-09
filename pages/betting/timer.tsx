import { ReactElement } from "react";
import dynamic from "next/dynamic";
import Frame from "../../components/betting/timer/Frame";

const BetContext = dynamic(
    () => import('../../components/betting/Context'),
    { ssr: false }
);

function Timer({auth}: {auth: string}): ReactElement {
    return <BetContext auth={auth}>
        <Frame auth={auth} />
    </BetContext>;
}

Timer.getInitialProps = ({query: {auth}}) => {
    return {auth};
}

export default Timer;