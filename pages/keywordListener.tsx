import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const KeyWordListenerPage = dynamic(
    () => import('../components/pages/keyWordListener'),
    { ssr: false }
);

function KeywordListener(props): ReactElement {
    return <KeyWordListenerPage {...props} />
}

KeywordListener.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default KeywordListener;