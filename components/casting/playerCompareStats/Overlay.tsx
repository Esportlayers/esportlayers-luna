import { ReactElement, useState, useEffect } from "react";
import { useMessageListener } from "../../websocket/MessageHandler";
import { motion, AnimatePresence } from "framer-motion";
import { isPlayerCompareGraphMessage, isStatsOverlayMessage } from "../../websocket/state";
import OverlayStats from "./OverlayStats";

const variants = {
    hidden: {
        opacity: 0,
        y: -100
    },
    visible: {
        opacity: 1,
        y: 0
    }
}

export default function Overlay({testing}: {testing: boolean}): ReactElement | null {
    const message = useMessageListener();
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(message && isStatsOverlayMessage(message) && !show && isPlayerCompareGraphMessage(message.value) ) {
            setData(message.value);   
            setShow(true);

            setTimeout(() => {
                setData(null);
                setShow(false);
            }, 10000);
        }
    }, [message]);

    return <AnimatePresence>
        {((show && data ) || testing) &&  <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <OverlayStats data={data}/>
        </motion.div>}
    </AnimatePresence>;
    
}
