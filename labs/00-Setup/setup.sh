#!/bin/bash
# chmod +x setup.sh
# ./setup.sh

# Define the search and replace pairs
declare -A replacements=(
    ["<MONGODB_Name>"]=""
    ["<MONGODB_CONNECTION_STRING>"]=""
    ["<AZURE_OPENAI_API_INSTANCE_NAME>"]=""
    ["<AZURE_OPENAI_API_KEY>"]=""
    ["<GRAPH_RAG_API>"]=""
    # see examples below
    # ["<MONGODB_Name>"]="aiapp1day_daniel_66"
    # ["<MONGODB_CONNECTION_STRING>"]="mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
    # ["<AZURE_OPENAI_API_INSTANCE_NAME>"]="arg-syd-aiapp1day-openai"
    # ["<AZURE_OPENAI_API_KEY>"]="0f73b2e1cba543ce8c9518712a5b1efc"
    # ["<GRAPH_RAG_API>"]="https://arg-syd-aiapp1day-ca--miqityv.niceisland-66754352.eastus.azurecontainerapps.io"
)

# Check if parent directory exists
if [ ! -d "../" ]; then
    echo "Parent directory not found!"
    exit 1
fi

echo "Searching for .env and .js files..."

# Find .env and .js files in parent directory
find /workspaces/aiapp1day/ -type f \( -name "*.env" -o -name "*.js" \) -not -path "*/node_modules/*" | while read -r file; do
    echo "Processing: $file"
    for search in "${!replacements[@]}"; do
        replace="${replacements[$search]}"
        sed -i "s|${search}|${replace}|g" "$file"
    done
done

echo "Replacements complete!"