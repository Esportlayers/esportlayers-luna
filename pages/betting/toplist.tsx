import { ReactElement } from "react";
import dynamic from "next/dynamic";
import ToplistFrame from "../../components/betting/Toplist/ToplistFrame";

const BetContext = dynamic(
    () => import('../../components/betting/Context'),
    { ssr: false }
);

function Toplist({auth, testing}: {auth: string; testing: boolean}): ReactElement {
    return <BetContext auth={auth}>
        <ToplistFrame auth={auth} testing={testing} />
    </BetContext>;
}

Toplist.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Toplist;