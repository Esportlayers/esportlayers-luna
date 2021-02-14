import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const GeneralPage = dynamic(
    () => import('../components/pages/general'),
    { ssr: false }
);

function General(props): ReactElement {
    return <GeneralPage {...props} />
}


General.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default General;