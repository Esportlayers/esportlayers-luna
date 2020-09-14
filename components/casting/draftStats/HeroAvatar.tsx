import { ReactElement } from "react";
import { getImageUrl } from "./Picture";

export default function HeroAvatar({heroClass, prefix='v'}: {heroClass: string; prefix?: 'v' | 'h' | 'i'}): ReactElement {
    return <picture>
        <source type="image/webp" srcSet={getImageUrl(`/static/heroes/${prefix}_${heroClass}.webp`)}/>
        <source type="image/jp2" srcSet={getImageUrl(`/static/heroes/${prefix}_${heroClass}.jp2`)}/>
        <img className={'image'} src={getImageUrl(`/static/heroes/${prefix}_${heroClass}.png`)} alt={heroClass} />

        <style jsx>{`
            .image {
                object-fit: contain;
                width: 100%;
                height: 100%;
            }    
        `}</style>
    </picture>;
}