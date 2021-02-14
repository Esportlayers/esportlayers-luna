import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const ToplistPage = dynamic(
    () => import('../../components/pages/voting/toplist'),
    { ssr: false }
);

function Toplist(props): ReactElement {
    return <ToplistPage {...props} />
}

Toplist.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Toplist;