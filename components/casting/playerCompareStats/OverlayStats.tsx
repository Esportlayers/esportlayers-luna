import { ReactElement } from "react";
import { PlayerCompareGraphValue } from "../../websocket/state";
import ValueBars from "./ValueBars";

interface Props {
    data: PlayerCompareGraphValue;
}

export const typeNameMap = {
    'net_worth': 'Net worth',
    'gpm': 'GPM',
    'xpm': 'XPM',
    'hero_damage': 'Hero Damage',
    'runes_activated': 'Rune Pickups',
    'camps_stacked': 'Camps Stacked',
    'support_gold_spent': 'Support Gold Spent'
}

export default function OverlayStats({data}: Props): ReactElement {
    return <div className={'container'}>
        <ValueBars data={data?.data || []} />
        <div className={'label'}>
            {typeNameMap[data?.dataType || 'net_worth']}
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
                top: 150px;
                font-size: 18px;
                color: #FFF;
                font-weight: bold;
            }   
        `}</style>
    </div>;
}