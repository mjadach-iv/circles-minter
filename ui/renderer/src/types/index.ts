import { type SVGProps } from "react";

// Extend the Window interface to include electronAPI
declare global {
    interface Window {
        electronAPI: {
            saveDb: (data: any) => void;
            getDb: () => Promise<any>;
            getUiSecret: () => Promise<string>;
            setAutostart: (value: boolean) => Promise<boolean>;
            getAutostart: () => Promise<boolean>;
            mintNow: () => Promise<void>;
            setAutoMinting: (value: boolean) => Promise<{ autoMinting: boolean, next: number}>;
            getAutoMinting: () => Promise<{ autoMinting: boolean, next: number}>;
            addMintStatusListener: (callback: (event: any, data: any) => void) => () => void;
        };
    }
}


export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Address = `0x${string}`
export type PrivateKey = Address;

