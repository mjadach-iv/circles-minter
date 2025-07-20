import React, { useState, useEffect } from "react";
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

type Props = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export default function AddAccount(props: Props) {
    const [privateKey, setPrivateKey] = useState("");
    const [publicAddress, setPublicAddress] = useState("");
    const [error, setError] = useState(false);
    // const [derivation, setDerivation] = useState("m/44'/60'/0'/0/0");

    useEffect(() => {
        if (privateKey.substring(0, 2) !== "0x") return;
        try {
            const account = privateKeyToAccount(privateKey as `0x{string}`);

            setPublicAddress(account.address);
            setError(false);
        } catch (e) {
            setError(true);
            setPublicAddress("");
        }
    }, [privateKey]);

    const handleGenerate = () => {
        const pk = generatePrivateKey();

        setPrivateKey(pk);
    };

    const handleClose = () => {
        props.onOpenChange(false);
        setPrivateKey("");
        setError(true);
        setPublicAddress("");
    };

    const handleSave = () => { };

    return (
        <>
            <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
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
                        <p className="mt-4">
                            Please enter the private key of the wallet you wish to use as the
                            owner for automatic minting, or generate a new one using the
                            button below.
                        </p>
                        <Input
                            className="mt-4"
                            label="Private key"
                            type="text"
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button size="sm" onPress={handleGenerate}>
                                Generate new private key
                            </Button>
                        </div>
                        <Input
                            disabled
                            className="mt-8 pointer-events-none"
                            label="Public address (derived from the private key)"
                            type="text"
                            value={publicAddress}
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
                            error ?
                                <Tooltip content="You need to add a correct private key">

                                    <Button
                                        color="primary"
                                        onPress={handleSave}
                                        disabled={error}
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
