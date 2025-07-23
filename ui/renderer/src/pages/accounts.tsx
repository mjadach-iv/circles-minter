import  { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { RiFolderAddFill } from "react-icons/ri";
import { title } from "../components/primitives";
import Card from "../components/card";
import DefaultLayout from "../layouts/default";
import AddAccount from "../components/addAccount";
import { useStore } from "../store";
import { useLocation, useNavigate } from "react-router-dom";

export default function DocsPage() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const accountsArray = useStore((state) => state.accounts);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const foo = params.get('add');

  useEffect(() => {
    if (foo) {
      setIsAddAccountOpen(true);
      // Remove search params from URL after opening modal
      navigate(location.pathname, { replace: true });
    }
  }, [foo, location.pathname, navigate]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Accounts</h1>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {
          accountsArray.length === 0 &&
          <p className="text-default-500">No accounts added yet.</p>
        }
        {
          accountsArray.map((account, index) => {
            return (
              <Card
                key={`accountsArray-${index}`}
                index={index}
                name={account.name}
                publicKey={account.publicKey}
              />
            );
          })
        }
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
    </DefaultLayout >
  );
}
