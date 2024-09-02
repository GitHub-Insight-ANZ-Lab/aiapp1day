touch ./src/api/BACKEND_URI.ts
echo "export const BACKEND_URI = '$APPSETTING_API_ENDPOINT';" > ./src/api/BACKEND_URI.ts
NODE_OPTIONS='--max_old_space_size=16384'

tsc && vite build
