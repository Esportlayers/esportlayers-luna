import { pixelsToPercent } from "framer-motion/types/render/dom/layout/scale-correction";
import { ReactElement } from "react";
import { PlayerCompareGraphValue } from "../../websocket/state";
import ValueBars from "./ValueBars";

interface Props {
    data: PlayerCompareGraphValue;
}

export const typeNameMap = {
    'gpm': 'GPM',
    'xpm': 'XPM',
    'hero_damage': 'Hero Damage',
    'runes_activated': 'Rune Pickups',
    'camps_stacked': 'Camps Stacked',
    'support_gold_spent': 'Support Gold Spent'
}

export const iconNameMap = {
    'gpm': 'GPM.svg',
    'xpm': 'XPM.svg',
    'hero_damage': 'hero_dmg.svg',
    'runes_activated': 'runes.svg',
    'camps_stacked': 'camps.svg',
    'support_gold_spent': 'support_gold.svg'
}

export default function OverlayStats({data}: Props): ReactElement {
    return <div className={'container'}>
        <ValueBars data={data?.data || [{absolute: 12354, percentage: 50}, {absolute: 43242, percentage: 23}, {absolute: 3, percentage: 10}]} />
        <div className={'typeContainer'}>
            <img src={'/images/icons/' + iconNameMap[data?.dataType || 'gpm']} alt={data?.dataType} />
        </div>
        <div className={'label'}>
            {typeNameMap[data?.dataType || 'gpm']}
        </div>

        <style jsx>{`
            .container {
                height: 1080px;
                width: 1920px;
                background-image: url('/images/player_compare_stats_1080p.png');
                background-repeat: no-repeat;
                background-size: cover;
                position: relative;
            } 

            .label {
                position: absolute;
                text-align: center;
                left: 0;
                right: 0;
                top: 210px;
                font-size: 18px;
                color: #FFF;
                font-weight: bold;
            }   

            .typeContainer {
                position: absolute; 
                top: 65px;
                left: 50%;
                height: 80px;
                width: 200px;
                transform: translateX(-50%);
                padding: 40px 0;
                display: flex;
                justify-content: center;
            }

            .typeContainer img {
                height: 100%;
                object-fit: cover;
            }

        `}</style>
    </div>;
}