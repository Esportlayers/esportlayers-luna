import { ReactElement } from "react";
import dynamic from 'next/dynamic';

const SliderPage = dynamic(
    () => import('../../components/pages/voting/slider'),
    { ssr: false }
);

function Slider(props): ReactElement {
    return <SliderPage {...props} />
}

Slider.getInitialProps = ({query: {auth, testing}}) => {
    return {auth, testing: Boolean(testing)};
}

export default Slider;