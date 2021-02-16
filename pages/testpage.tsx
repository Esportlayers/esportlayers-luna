import { ReactElement } from "react";


export default function Testpage(): ReactElement {
    const a = () => new Error('test');
    return <button onClick={a}>Error</button>;
}