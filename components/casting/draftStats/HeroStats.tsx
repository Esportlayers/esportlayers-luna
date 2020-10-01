import React, { ReactElement } from "react";
import HeroAvatar from "./HeroAvatar";

interface Props {
    heroClass?: string;
    totalGamesCount?: number;
    matchCount?: number;
    matchWins?: number;
    banCount?: number;
}

export default function HeroStats({matchCount = 0, matchWins = 0, totalGamesCount = 0, banCount = 0, heroClass = 'zuus'}: Props): ReactElement {
    const winRate = matchCount > 0 ? Math.floor(((matchWins) * 100) / matchCount) : 0;
    const banRate = totalGamesCount > 0 ? Math.floor(((banCount || 0) * 100) / totalGamesCount) : 0;
    const pickRate = totalGamesCount > 0 ? Math.floor((matchCount * 100) / totalGamesCount) : 0;

    return <div className={'entry'}>
        <div className={'avatar'}>
            <HeroAvatar heroClass={heroClass} prefix={'h'} />
        </div>
        <div className={'stats'}>
            <div>
                <div className={'value'}>{matchWins}/{matchCount} ({winRate}%)</div>
                <div>WINRATE</div>
            </div>
            <div>
                <div className={'value picks'}>{pickRate}%</div>
                <div>PICKS</div>
            </div>
            <div>
                <div className={'value bans'}>{banRate}%</div>
                <div>BANS</div>
            </div>
        </div>
            

        <style jsx>{`
            .entry {
                height: 3rem;
                padding: .5rem 1.2rem .5rem .5rem;
                display: inline-flex;
                align-items: center;
                background: #FFF;
                font-size: 1rem;
                box-shadow: -2px 2px 15px 0 rgba(0,0,0,0.2);
                justify-self: flex-end;
            }    

            .avatar {
                height: 3rem;
                object-fit: cover;
                flex-shrink: 0;
                margin-right: 1.5rem;
                width: 6rem;
            }

            .stats {
                display: grid;
                align-items: center;
                grid-template-columns: max-content max-content max-content;
                grid-column-gap: 1.2rem;
                flex-grow: 1;
            }

            .value {
                font-weight: bold;
            }    

            .picks {
                color: #5DB93C;
            }

            .bans {
                color: #D6342A;
            }
        `}</style>
    </div>;
}
