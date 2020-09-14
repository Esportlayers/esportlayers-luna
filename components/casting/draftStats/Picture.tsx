import { ReactElement } from "react";

type Accessor = 'userAvatar';

interface Locator {
    [x: string]: {
        fallback: string;
        webp: string;
        jp2: string;
    };
}
const locator: Locator = {
    userAvatar: {
        fallback: 'avatar',
        webp: 'avatarWEBP',
        jp2: 'avatarJP2',
    }
}

export function getImageUrl(path: string): string {
    return process.env.API_URL + path;
}

interface Props {
    entitiy: object;
    accessor: Accessor;
    alt: string;
}
export default function Picture({entitiy, accessor, alt}: Props): ReactElement {
    if(entitiy) {
        const fallbackSource = entitiy[locator[accessor].fallback];
        const webpSource = entitiy[locator[accessor].webp];
        const jp2Source = entitiy[locator[accessor].jp2];
    
        return <picture>
            <source type="image/webp" srcSet={getImageUrl(webpSource)}/>
            <source type="image/jp2" srcSet={getImageUrl(jp2Source)}/>
            <img className={'image'} src={getImageUrl(fallbackSource)} alt={alt} />

            <style jsx>{`
                .image {
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }    
            `}</style>
        </picture>;
    }

    return <></>;
}