#!/bin/bash
# chmod +x setup.sh
# ./setup.sh

# Define the search and replace pairs
declare -A replacements=(
    ["<MONGODB_Name>"]="add_value"
    ["<MONGODB_CONNECTION_STRING>"]="add_value"
    ["<AZURE_OPENAI_API_INSTANCE_NAME>"]="arg-syd-aiapp1day-openai"
    ["<AZURE_OPENAI_API_KEY>"]="add_value"
    ["<GRAPH_RAG_API>"]="https://arg-syd-aiapp1day-ca.ashycoast-2c2322dd.eastus.azurecontainerapps.io"
    # see examples below
    # ["<MONGODB_Name>"]="aiapp1day_daniel_66"
    # ["<MONGODB_CONNECTION_STRING>"]="mongodb+srv://aiapp1dayadmin:Aiapp1daypassword123@arg-syd-aiapp1day-mongo.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
    # ["<AZURE_OPENAI_API_INSTANCE_NAME>"]="arg-syd-aiapp1day-openai"
    # ["<AZURE_OPENAI_API_KEY>"]="a30df7e6e63f424884fde2f86b2624b5"
    # ["<GRAPH_RAG_API>"]="https://arg-syd-aiapp1day-ca.ashycoast-2c2322dd.eastus.azurecontainerapps.io"
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
        # replace="${replacements[$search]}"
        replace=$(echo "${replacements[$search]}" | sed 's/&/\\&/g')
        sed -i "s|${search}|${replace}|g" "$file"
    done
done

echo "Replacements complete!"