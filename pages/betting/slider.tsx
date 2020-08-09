import { ReactElement } from "react";
import dynamic from "next/dynamic";
import Frame from "../../components/betting/Slider/Frame";

const BetContext = dynamic(
    () => import('../../components/betting/Context'),
    { ssr: false }
);

function Slider({auth}: {auth: string}): ReactElement {
    return <BetContext auth={auth}>
        <Frame auth={auth} />
    </BetContext>;
}

Slider.getInitialProps = ({query: {auth}}) => {
    return {auth};
}

export default Slider;