import { useState, useEffect } from "react";
import { title } from "../components/primitives";
import DefaultLayout from "../layouts/default";

import {Switch} from "@heroui/react";


export default function IndexPage() {
  const [autostart, setAutostart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch autostart status from Electron main
    if (window.electronAPI) {
      window.electronAPI.getAutostart().then((value) => {
        setAutostart(!!value);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    if (window.electronAPI) {
      const newValue = !autostart;
      const rez = await window.electronAPI.setAutostart(newValue);
      console.log('Setting autostart:', rez);
      setAutostart(rez);
    }
    setLoading(false);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Settings</h1>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="flex items-center gap-4">
          <Switch
            onValueChange={handleToggle}
            isSelected={autostart}
            disabled={loading}
          >
            Autostart with your system
          </Switch>
        </div>
      </section>
    </DefaultLayout>
  );
}
