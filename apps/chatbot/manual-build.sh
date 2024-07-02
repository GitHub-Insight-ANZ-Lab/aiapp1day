#!/bin/sh


echo ""
echo "Restoring frontend npm packages"
echo ""

npm install
if [ $? -ne 0 ]; then
    echo "Failed to restore frontend npm packages"
    exit $?
fi

echo ""
echo "Set environment variable"
echo ""

export APPSETTING_API_ENDPOINT="https://localhost:5000"

echo ""
echo "Building frontend"
echo ""

npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build frontend"
    exit $?
fi

