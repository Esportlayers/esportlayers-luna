import { ReactElement, useState, useEffect } from "react";
import { useMessageListener } from "../../websocket/MessageHandler";
import { isRoshanMessage } from "../../websocket/state";
import { useInterval } from "../../../hooks/interval";
import Timer from "./Timer";

export default function Overlay({testing}: {testing: boolean}): ReactElement | null {
    const message = useMessageListener();
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        if(message && isRoshanMessage(message)) {
            setRemaining(message.value);
        }
    }, [message]);

    useInterval(() => remaining > 0 && setRemaining(remaining - 1));

    if(remaining > 0 || testing) {
        return <Timer remaining={remaining} />;
    }
    return null;
}