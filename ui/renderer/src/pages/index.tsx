import { Button, Tooltip } from "@heroui/react";
import { CircularProgress } from "@heroui/react";
import DefaultLayout from "../layouts/default";
import Clock from "../components/clock";
import AccountCard from "../components/cardAccount";
import { useStore } from "../store";
import { Link } from "react-router-dom";
import { type Address } from "../types";

export default function IndexPage() {
  const {
    profiles,
    loadingApp,
    isMinting,
    automaticMinting,
    nextAutoMint,
    totalMintable
  } = useStore();
  const profilesOwners = Object.keys(profiles);
  const canMint = totalMintable > 0;

  const areThereProfiles = () => {
    for (const ownerAddress of profilesOwners) {
      const profilesOfOwner = profiles[ownerAddress];
      if (profilesOfOwner && profilesOfOwner.length > 0) {
        return true;
      }
    }
    return false;
  };
  const thereAreProfiles = areThereProfiles();

  return (
    <DefaultLayout>
      <div>
        <p
          className='text-lg mb-2'
          style={{ width: '100%', maxWidth: '500px', margin: 'calc(var(--spacing) * 2) auto' }}
        >
          {
            isMinting ?
              'Minting...'
              :
              automaticMinting
                ?
                'Time till next mint:'
                :
                'New mintable CRC in:'
          }
        </p>

        <Clock
          key={`just-rerender-${automaticMinting}-${nextAutoMint}`}
          aroundAnimation={isMinting}
          countdownTo={automaticMinting ? nextAutoMint : undefined}
        />
        {
          loadingApp ? (
            <div
              className="flex flex-col items-center justify-center"
              style={{ width: '100%', maxWidth: '500px', margin: '64px auto 8px' }}
            >
              <CircularProgress aria-label="Loading..." size="lg" />
              <p className="text-default-500 text-center mt-8">Loading...</p>
            </div>
          )
            :
            thereAreProfiles ?
              <>
                <div
                  className="flex items-center justify-between"
                  style={{ width: '100%', maxWidth: '500px', margin: '16px auto 32px' }}
                >
                  {
                    automaticMinting ?
                      <Button
                        size="md"
                        onPress={() => useStore.getState().setAutoMinting(false)}
                      >
                        Stop Automatic Minting
                      </Button>
                      :
                      <Button
                        size="md"
                        onPress={() => useStore.getState().setAutoMinting(true)}
                      >
                        Start Automatic Minting
                      </Button>
                  }
                  {
                    canMint ?
                      <Button
                        size="md"
                        onPress={() => useStore.getState().mintNow()}
                        style={{
                          width: '100px'
                        }}
                        isLoading={isMinting}
                      >
                        {isMinting ? 'Minting' : 'Mint now'}
                      </Button>
                      :
                      <Tooltip 
                        content="No CRC to mint"
                        placement='bottom'
                      >
                        <span>
                        <Button
                          size="md"
                          style={{
                            width: '100px'
                          }}
                          isDisabled={true}
                        >
                          Mint now
                        </Button>
                        </span>
                      </Tooltip>
                  }
                </div>
                <Accounts />
              </>
              :
              <div
                className="flex flex-col items-center justify-center"
              >
                <p className="text-default-500 text-center mt-20">No Circles accounts found.</p>
                <Link
                  to="/accounts?add=true"
                  className="text-default-500 text-center mt-2"
                >
                  <Button
                    size="md"
                    className="mt-4"
                  >
                    Add an account
                  </Button>
                </Link>
              </div>
        }
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
          const ownerProfiles = profiles[ownerAddress];
          return ownerProfiles.map((profile: { address: Address; description: string; name: string; image: string; }) => {
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
