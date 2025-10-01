/// <reference types="vite/client" />

declare module "*.png" {
    const src: string;
    export default src;
}
declare module "*.jpg" {
    const src: string;
    export default src;
}
declare module "*.jpeg" {
    const src: string;
    export default src;
}
declare module "*.gif" {
    const src: string;
    export default src;
}
declare module "*.svg" {
    const src: string;
    export default src;
}
// если используешь SVGR с ?react
declare module "*.svg?react" {
    import * as React from "react";
    const Component: React.FC<React.SVGProps<SVGSVGElement>>;
    export default Component;
}
// если подгружаешь .riv
declare module "*.riv" {
    const src: string;
    export default src;
}
