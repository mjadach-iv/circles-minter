#!/bin/bash

mkdir ./dist/binary
node --experimental-sea-config sea-config.json

OS_TYPE=$(uname -s)
OUTFILE=""
case "$OS_TYPE" in
    Linux*)
        OUTFILE="crc-auto-minter-linux"
        node -e "require('fs').copyFileSync(process.execPath, './dist/binary/$OUTFILE')"
        npx postject ./dist/binary/$OUTFILE NODE_SEA_BLOB ./dist/binary/crc-auto-minter.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
        ;;
    Darwin*)
        OUTFILE="crc-auto-minter-macos"
        node -e "require('fs').copyFileSync(process.execPath, './dist/binary/$OUTFILE')"
        codesign --remove-signature ./dist/binary/$OUTFILE
        npx postject ./dist/binary/$OUTFILE NODE_SEA_BLOB ./dist/binary/crc-auto-minter.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
            --macho-segment-name NODE_SEA
        codesign --sign - ./dist/binary/$OUTFILE
        ;;
    CYGWIN*|MINGW*|MSYS*)
        OUTFILE="crc-auto-minter-win.exe"
        node -e "require('fs').copyFileSync(process.execPath, './dist/binary/$OUTFILE')"
        # signtool remove /s $OUTFILE
        npx postject ./dist/binary/$OUTFILE NODE_SEA_BLOB ./dist/binary/crc-auto-minter.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
        # signtool sign /fd SHA256 $OUTFILE
        ;;
    *)
        echo "Unknown OS: $OS_TYPE"
        exit 1
        ;;
esac

rm ./dist/binary/crc-auto-minter.blob

