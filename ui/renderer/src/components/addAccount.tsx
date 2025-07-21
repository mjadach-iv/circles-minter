import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Tooltip
} from "@heroui/react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { FaEye, FaEyeSlash, FaRegCopy } from "react-icons/fa";
import { useStore } from "@/store";
import type { Address } from "@/types";

type Props = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};

export default function AddAccount(props: Props) {
    const [name, setName] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [publicAddress, setPublicAddress] = useState("");
    const [error, setError] = useState(true);
    const [alreadyAddedError, setAlreadyAddedError] = useState(false);
    const [visibility, setVisibility] = useState(false);
    const accounts = useStore((state) => state.accounts);
    const alreadyAddedPublicKeys = accounts.map(account => account.publicKey);  
    const nextAccount = accounts.length + 1;
    const addAccountToStore = useStore((state) => state.addAccount);

    useEffect(() => {
        setName(`Account #${nextAccount}`)
    }, [nextAccount]);

    useEffect(() => {
        if (privateKey.substring(0, 2) !== "0x") return;
        try {
            const account = privateKeyToAccount(privateKey as `0x{string}`);
            setPublicAddress(account.address);
            setError(false);

            if(alreadyAddedPublicKeys.includes(account.address as Address)) {
                setAlreadyAddedError(true);
            } else {
                setAlreadyAddedError(false);
            }

        } catch (e) {
            setError(true);
            setPublicAddress("");
            setAlreadyAddedError(false);
        }
    }, [privateKey, alreadyAddedPublicKeys]);

    const handleGenerate = () => {
        const pk = generatePrivateKey();
        setPrivateKey(pk);
    };

    const handleClose = () => {
        props.onOpenChange(false);
        setPrivateKey("");
        setError(true);
        setPublicAddress("");
        setAlreadyAddedError(false);
    };

    const handleSave = () => {
        addAccountToStore(name, privateKey as `0x{string}`)
        handleClose();
    };

    return (
        <>
            <Modal 
                isOpen={props.isOpen} 
                onOpenChange={props.onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Add account</ModalHeader>
                    <ModalBody>
                        <p>
                            In order to use automatic minting, you need to add to your Metri
                            (or Circle) account a new owner account. Each owner account
                            consists of a private key and a public address. The private key is
                            secret and should be kept safe, while the public address
                            automatically derived from that private key is used to identify
                            the account on the network. You can always remove the owner from
                            your account if you choose to stop using it.
                        </p>
                        <Input
                            className="mt-4"
                            label="Name of the account "
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className="mt-4">
                            Please enter the private key of the wallet you wish to use as the
                            owner for automatic minting, or generate a new one using the
                            button below.
                        </p>
                        <Input
                            className="mt-4"
                            label="Private key"
                            type={visibility ? "text" : "password"}
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            endContent={
                                <>
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-hidden mr-2"
                                        type="button"
                                        onClick={()=>{
                                            setVisibility((curr)=>!curr);
                                        }}
                                    >
                                        {visibility ? (
                                            <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-hidden"
                                        type="button"
                                        onClick={()=>{
                                            copyToClipboard(privateKey);
                                        }}
                                    >
                                        <FaRegCopy className="text-2xl text-default-400 pointer-events-none" />
                                    </button>
                                </>
                            }
                        />
                        <div className="flex justify-end">
                            <Button size="sm" onPress={handleGenerate}>
                                Generate new private key
                            </Button>
                        </div>
                        <Input
                            disabled
                            className="mt-4 pointer-events-none"
                            label="Public address (derived from the private key)"
                            type="text"
                            value={publicAddress}
                             endContent={
                                <>
                                    <button
                                        aria-label="copy"
                                        className="focus:outline-hidden"
                                        type="button"
                                        onClick={()=>{
                                            copyToClipboard(publicAddress);
                                        }}
                                    >
                                        <FaRegCopy className="text-2xl text-default-400 pointer-events-none" />
                                    </button>
                                </>
                            }
                        />
                        <p className="mt-4">
                            Remember that the public address needs to be added as an owner to your Metri (or Circle). In order to do that you need to go to the wallet settings, then Wallet Owners and add the public address as an external owner.
                        </p>
                        {/* <Accordion defaultExpandedKeys={["2"]}>
                <AccordionItem
                    key="1"
                    aria-label="Advanced options"
                    title="Advanced options"
                >
                    <Input
                        label="Derivation path"
                        type="text"
                        value={derivation}
                        onChange={e => setDerivation(e.target.value)}
                    />
                </AccordionItem>
            </Accordion> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={handleClose}>
                            Close
                        </Button>
                        {
                            (error || alreadyAddedError) ?
                                <Tooltip 
                                    content={
                                        alreadyAddedError ?
                                        "You already added this account" :
                                        "You need to provide a correct private key"
                                    }
                                >
                                    <Button
                                        color="primary"
                                        disabled={true}
                                        variant="flat"
                                    >
                                        Save
                                    </Button>
                                </Tooltip>
                                :
                                <Button
                                    color="primary"
                                    onPress={handleSave}
                                    disabled={error}
                                    variant="solid"
                                >
                                    Save
                                </Button>
                        }

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
