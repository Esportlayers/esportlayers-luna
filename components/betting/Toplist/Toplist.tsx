import React, { ReactElement, Fragment } from "react";
import { BetOverlay } from "@streamdota/shared-types";
import classNames from "classnames";

interface Props {
    list: Array<{name: string; won: number; total: number}>;
    overlay: BetOverlay;
}

function getAccuracy(win, total): string {
    const acc = Math.round((win * 100) / total);
    return '' + acc;
}

export default React.memo(function Toplist({list, overlay}: Props): ReactElement {
    return <div className={classNames('toplist', {rank: overlay.toplistShowRank})}>
        {list.map((user, idx) => <Fragment key={user.name}>
            {Boolean(overlay.toplistShowRank) && <div>{idx + 1}.</div>}
            <div className={'name'}>{user.name}</div>
            <div className={'result'}>
                {user.won}
                {Boolean(overlay.toplistShowTotalBets) && `/${user.total}`}
                {Boolean(overlay.toplistShowAccuracy) && ` (${getAccuracy(user.won, user.total)}%)`}
            </div>
        </Fragment>)}

        <style jsx>{`
            .toplist {
                background-color: ${overlay.toplistBackground};
                color: ${overlay.toplistFont};
                font-size: ${overlay.toplistFontSize}px;
                padding: .5em;
                line-height: 1em;
                display: grid;
                grid-template-columns: 1fr max-content;
                grid-row-gap: .25em;
            }

            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space:nowrap;
            }

            .rank {
                grid-template-columns: max-content 1fr max-content;
            }

            .result {
                text-align: right;
            }
        `}</style>
    </div>;
});