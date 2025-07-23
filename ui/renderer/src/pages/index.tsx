import { Link } from "@heroui/react";
import { Button } from "@heroui/react";

import DefaultLayout from "../layouts/default";
import Clock from "../components/clock";
import AccountCard from "../components/cardAccount";
import { useStore } from "../store";

export default function IndexPage() {
  const minting = useStore((state) => state.minting);
  const automaticMinting = useStore((state) => state.automaticMinting);

  return (
    <DefaultLayout>
      <div>
        <p className='text-lg mb-2'>{
          minting ?
           'Minting...' 
           : 
           automaticMinting 
           ? 
            'Time till next mint:' 
            : 
            'New CRC in:' }
        </p>
        
        <Clock
          minting={minting}
        />
        <div
          className="flex items-center justify-between"
          style={{ width: '100%', maxWidth: '500px', margin: '16px auto 32px' }}
        >
          <Button
            size="md"
          >
            Start Automatic Minting
          </Button>
          <Button
            size="md"
          >
            Mint Now
          </Button>
        </div>
        <Accounts />
      </div>
    </DefaultLayout>
  );
}


function Accounts() {
  const { profiles } = useStore();
  const profilesOwners = Object.keys(profiles);
  console.log('Profiles:', profiles);
  console.log('profilesOwners:', profilesOwners);
  return (
    <div className="accounts-list flex flex-row flex-wrap justify-center gap-4 ">
      {
        profilesOwners.map((ownerAddress) => {
          console.log('Owner Address:', ownerAddress);
          const ownerProfiles = profiles[ownerAddress];
          return ownerProfiles.map((profile) => {
            return (
              <AccountCard
                key={`AccountCard-${profile.address}`}
                address={profile.address}
                description={profile.description}
                name={profile.name}
                image={profile.image}
              />
            );
          });
        })
      }
    </div>
  );
}
