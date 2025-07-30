import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Image,
    Button
} from "@heroui/react";
import { FaTrashAlt } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoMdRefreshCircle } from "react-icons/io";
import { useStore } from "../store";
import type { Address } from "../types";

type Props = {
    name: string;
    publicKey: Address;
    index: number;
};

export default function CardComponent(props: Props) {
    const removeAccount = useStore((state) => state.removeAccount);
    const refreshProfiles = useStore((state) => state.refreshProfiles);
    const [isFetching, setIsFetching] = useState(false);
    const allProfiles = useStore((state) => state.profiles);
    const profilesOfTheOwner = allProfiles[props.publicKey];


    async function handleRefreshProfiles() {
        const start = Date.now();
        setIsFetching(true);
        await refreshProfiles(props.publicKey);
        if (Date.now() - start < 1000) {
            await new Promise(resolve => setTimeout(resolve, 1000 - (Date.now() - start)));
        }
        setIsFetching(false);
    }

    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                {/* <Image
                    alt="heroui logo"
                    height={40}
                    radius="sm"
                    src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                    width={40}
                /> */}
                <MdAccountBalanceWallet
                    size={32}
                />
                <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-md">{props.name}</p>
                    <Button
                        color="danger"
                        startContent={<FaTrashAlt />}
                        variant="bordered"
                        style={{
                            padding: 0,
                            minWidth: '40px'
                        }}
                        onPress={() => {
                            props.index !== undefined && removeAccount(props.index);
                        }}
                    />
                </div>
            </CardHeader>
            <Divider />
            <CardBody
                className="font-mono text-sm"
            >
                <p>{props.publicKey}</p>
            </CardBody>
            <Divider />
            <CardFooter>
                <div>
                    {
                        (!profilesOfTheOwner || profilesOfTheOwner?.length === 0) &&
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-default-500">No Circles account found.</p>
                            <IoMdRefreshCircle 
                                className = {`text-default-700 ${isFetching ? 'animate-spin ' : ''}`}
                                onClick={handleRefreshProfiles}
                            />
                        </ div>
                    }
                    {
                        (profilesOfTheOwner && profilesOfTheOwner?.length !== 0) &&
                        <>
                            <p className="text-sm text-default-500">Circles accounts:</p>
                            <ul>
                                {profilesOfTheOwner?.map((profile) => (
                                    <li
                                        key={profile.address}
                                        style={{
                                            listStyle: 'disc',
                                            marginLeft: '16px',
                                        }}
                                    >
                                        <Link
                                            isExternal
                                            showAnchorIcon
                                            href={`https://explorer.aboutcircles.com/avatar/${profile.address}`}
                                        >
                                            {profile.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    }
                </div>
            </CardFooter>
        </Card>
    );
}
