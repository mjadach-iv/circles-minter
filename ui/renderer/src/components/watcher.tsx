import { useEffect } from "react";
import { useStore } from "../store";

export default function Watcher() {
  const { setIsMinting, getAutoMinting, balances, setTotalMintable } = useStore();

  useEffect(() => {
    const handler = (event, data: { 
      isMinting: boolean,
      tx?: string,
      error?: string,
    }) => {
        console.log('Received from main:', data);
        if (data.tx || data.error) {
          getAutoMinting();

        }
        setIsMinting(data.isMinting);
    };
    const removeMintStatusListener = window.electronAPI.addMintStatusListener(handler);
    return () => removeMintStatusListener(); // clean up
  }, []);

  useEffect(() => {
    const profileAddresses = Object.keys(balances);
    let accoumulator = 0;
    for (const profileAddress of profileAddresses) {
      const profile = balances[profileAddress];
      accoumulator += profile.mintable || 0;
    }
    setTotalMintable(accoumulator);
  }, [balances]);

  return <></>;
}