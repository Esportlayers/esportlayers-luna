import { ReactElement } from "react";
import dynamic from "next/dynamic";
import ToplistFrame from "../../components/betting/Toplist/ToplistFrame";

const BetContext = dynamic(
    () => import('../../components/betting/Context'),
    { ssr: false }
);

function Toplist({auth}: {auth: string}): ReactElement {
    return <BetContext auth={auth}>
        <ToplistFrame auth={auth} />
    </BetContext>;
}

Toplist.getInitialProps = ({query: {auth}}) => {
    return {auth};
}

export default Toplist;