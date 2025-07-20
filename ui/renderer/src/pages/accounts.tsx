import React, { useState } from "react";
import { Button } from "@heroui/react";
import { RiFolderAddFill } from "react-icons/ri";

import { title } from "@/components/primitives";
import Card from "@/components/card";
import DefaultLayout from "@/layouts/default";
import AddAccount from "@/components/addAccount";

export default function DocsPage() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Accounts</h1>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card
          name="Accounts"
          privateKey="your-private-key"
          publicKey="0xcd2a3d9f938e13cd947ec0i8um67fe734df8d8861"
        />
      </section>

      <AddAccount
        isOpen={isAddAccountOpen}
        onOpenChange={setIsAddAccountOpen}
      />
      <Button
        isIconOnly
        className="fixed bottom-4 right-4 z-50 size-14"
        color="primary"
        style={{
          background: "none",
        }}
        variant="flat"
        onPress={() => {
          setIsAddAccountOpen(true);
        }}
      >
        <RiFolderAddFill className="text-default-500 size-12" />
      </Button>
    </DefaultLayout>
  );
}
