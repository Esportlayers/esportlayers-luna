import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const AntiSnipePage = dynamic(
    () => import('../components/pages/antiSnipe'),
    { ssr: false }
);

function AntiSnipe(props): ReactElement {
    return <AntiSnipePage {...props} />
}

AntiSnipe.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default AntiSnipe;