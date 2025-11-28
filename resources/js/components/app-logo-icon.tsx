import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { src = '/images/jamo-logo-1.png', alt = 'App logo', ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
}
