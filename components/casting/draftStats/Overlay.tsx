import { ReactElement, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroStats from "./HeroStats";
import { EventTypes, isHeroStatsOverlayMessage, StatsOverlayMessage, useTetherMessageListener } from "@esportlayers/io";

const variants = {
    hidden: {
        opacity: 0,
        x: '100%'
    },
    visible: {
        opacity: 1,
        x: '0px'
    }
}

export default function Overlay({testing}: {testing: boolean}): ReactElement | null {
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);
    const {value: draftStats} = useTetherMessageListener<StatsOverlayMessage>(EventTypes.statsoverlay) || {value: null};

    useEffect(() => {
        if(!show && draftStats && isHeroStatsOverlayMessage(draftStats) ) {
            setData(draftStats);   
            setShow(true);

            setTimeout(() => {
                setData(null);
                setShow(false);
            }, 10000);
        }
    }, [draftStats]);

    return <AnimatePresence>
        {((show && data ) || testing) &&  <motion.div initial={'hidden'} animate={'visible'} exit={'hidden'} variants={variants} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <HeroStats {...data} />
        </motion.div>}
    </AnimatePresence>;
    
}
