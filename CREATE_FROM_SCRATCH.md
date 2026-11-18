
### Create the nextjs app scaffolding
```npx create-next-app@15.1.1 nextjs-from-scratch --typescript --eslint --app --no-src-dir --use-npm --no-tailwind --import-alias "@/*"```

### Install mongo npm
```
npm install mongodb@^6.12.0
npm ci
```

### Create project directories
```mkdir -p lib pages/api css public```

### Create local mongodb docker container
```docker run -d -p 27017:27017 -v ~/mongodb:/data/db --name mongo mongo```

### Create .env.local
```echo "export MONGODB_URI=mongodb://127.0.0.1:27017" > .env.local```
