# CRC (Circles) Auto Minter

### Save on the Metri fees, inviter fees, and group fees and never again miss minting your CRC


## Project description
- The script automatically mints Circles tokens every 24 hours for all accounts associated with your provided private key.
- Minting is fully sponsored - your owner wallet does not need any funds for gas fees.
- Metri fees, inviter fees, and group fees (which make a total of 25% of the minted amount that you lose) will not be deducted from your account. Instead, half of the original fees will be directed to the CRC Auto Mint safe.
- Code is open source, and the docker image is built directly on GitHub for full transparency, or you can also build it yourself.
- If you are unfamiliar with creating or providing a private key, this program may not be suitable for you. However, if you proceed without supplying a private key, the script will securely generate one for you and display it on first run.


## How to run

1. [Download an image using Docker](#download-an-image-using-docker)
2. [Build a Docker image on your own](#build-a-docker-image-on-your-own)
3. [Build a binary on your own](#build-a-binary-on-your-own)


## Download an image using Docker

### Requirements

- **Docker** must be installed if you want to build or run the Docker image.

### Step-by-step Instructions

1. **Set your private key as an environment variable when running the container:**

    ```sh
    docker run -d --name crc-auto-minter --restart always -e PRIVATE_KEY=your_private_key 0xmj/crc-auto-minter:latest
    ```

    Replace `your_private_key` with your actual Ethereum private key (starting with `0x`).

2. Optional: Check the Docker container logs

    ```sh
    docker logs -f crc-auto-minter
    ```

## Build a Docker image on your own

### Requirements

- **Docker** must be installed if you want to build or run the Docker image.
- [cometh.io](https://cometh.io/) API keys

### Step-by-step Instructions

1. **Fill in the required variables in .env file**
   ```sh
    PUBLIC_CONNECT_4337_COMETH_API_KEY=
    PUBLIC_COMETH_API_KEY=
   ```

2. **Build the Docker image**

    ```sh
    docker build -t crc-auto-minter .
    ```

3. **Run the Docker container**

    Set your private key as an environment variable when running the container:

    ```sh
    docker run -d --name crc-auto-minter --restart always -e PRIVATE_KEY=your_private_key crc-auto-minter
    ```

    Replace `your_private_key` with your actual Ethereum private key (starting with `0x`).


3. **Optional**: Check the Docker container logs

    ```sh
    docker logs -f crc-auto-minter
    ```


## Build a Binary (Standalone Executable)

### Requirements

- **Node.js 22** (or newer) must be installed on your system to build the binary. You do not need Node.js to run the resulting binary.
- [cometh.io](https://cometh.io/) API keys

### Step-by-step Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Fill in the required variables in .env file**
   ```sh
    PUBLIC_CONNECT_4337_COMETH_API_KEY=
    PUBLIC_COMETH_API_KEY=
   ```

3. **Build the project bundle:**
   ```sh
   npm run build:bundle
   ```

4. **Build the binary executable:**
   ```sh
   npm run build:binary
   ```

The resulting binary will be located in the `./dist/binary` directory.

The binary is self-contained and does not require Node.js to be installed on the target machine.