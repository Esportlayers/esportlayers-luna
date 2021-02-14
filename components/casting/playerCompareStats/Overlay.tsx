import { ReactElement, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OverlayStats from "./OverlayStats";
import { EventTypes, isPlayerCompareGraphMessage, StatsOverlayMessage, useTetherMessageListener } from "@esportlayers/io";

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
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);
    const {value: heroStats} = useTetherMessageListener<StatsOverlayMessage>(EventTypes.statsoverlay) || {value: null};

    useEffect(() => {
        if(!show && heroStats && isPlayerCompareGraphMessage(heroStats) ) {
            setData(heroStats);   
            setShow(true);

            setTimeout(() => {
                setData(null);
                setShow(false);
            }, 10000);
        }
    }, [heroStats]);

    return <AnimatePresence>
        {((show && data ) || testing) &&  <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <OverlayStats data={data}/>
        </motion.div>}
    </AnimatePresence>;
    
}
