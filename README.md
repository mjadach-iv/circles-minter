# CRC (Circles) Auto Minter

### Save on the Metri fees, inviter fees, and group fees
 

## Project description 
- The script automatically mints Circles tokens every 24 hours for all accounts associated with your provided private key.
- Minting is fully sponsored - your owner wallet does not need any funds for gas fees.
- Metri fees, inviter fees, and group fees (which makes total of 25% of the minted amount that you lose) will not be deducted from your account. Instead, half of the original fees will be directed to the creator of this script.
- Code is opendource, it it built directly on github for full transparency or you can also built it yourself.
- If you are unfamiliar with creating or providing a private key, this program may not be suitable for you. However, if you proceed without supplying a private key, the script will securely generate one for you and display it on first run.


## Docker Usage

### 1. Build the Docker image

```sh
docker build -t crc-auto-minter .
```

### 2. Run the Docker container

Set your private key as an environment variable when running the container:

```sh
docker run -d --name crc-auto-minter --restart always -e PRIVATE_KEY=your_private_key crc-auto-minter
```

Replace `your_private_key` with your actual Ethereum private key (starting with `0x`).


### Optional: Check the Docker container logs

```sh
docker logs -f crc-auto-minter
```