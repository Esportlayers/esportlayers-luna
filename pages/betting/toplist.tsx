import { ReactElement } from "react";
import dynamic from "next/dynamic";
import Frame from "../../components/betting/Toplist/Frame";

const BetContext = dynamic(
    () => import('../../components/betting/Context'),
    { ssr: false }
);

function Toplist({auth}: {auth: string}): ReactElement {
    return <BetContext auth={auth}>
        <Frame auth={auth} />
    </BetContext>;
}

Toplist.getInitialProps = ({query: {auth}}) => {
    return {auth};
}

export default Toplist;