import { ReactElement } from "react";


export default function Testpage(): ReactElement {
    const a = () => {
        throw new Error('test');
    }
    return <button onClick={a}>Error</button>;
}