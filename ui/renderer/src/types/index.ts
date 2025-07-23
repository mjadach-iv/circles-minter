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
        };
    }
}


export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Address = `0x${string}`
export type PrivateKey = Address;

