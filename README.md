# nextjs-from-scratch
Create a nextjs app from scratch, get data from a mongodb database and display the data on a page.
## Pre-requisites
 - node ^v22.14.0
 - npm
 - docker or mongodb running locally or in the cloud
 
## Initial setup
### Create the nextjs app scaffolding
```shell
npx create-next-app@15.1.1 nextjs-from-scratch \
    --typescript \
    --eslint \
    --app \
    --no-src-dir \
    --use-npm \
    --no-tailwind \
    --import-alias "@/*"
```

### Install mongo npm
```
npm install mongodb@^6.12.0
npm ci
```

### Create project directories
```mkdir -p lib pages/api css public```

### Create local mongodb docker container
```docker run -d -p 27017:27017 -v ~/mongodb:/data/db --name mongo mongo```

### Load data
Import the eod_market_index.json to a mongo database named 'market' in a collection named 'eod_market_index'.

### Create .env.local
```
echo "export MONGODB_URI=mongodb://127.0.0.1:27017" > .env.local
source .env.local
```

## Library
### Create lib/mongodb.ts

```typescript
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: 'devrel.template.nextjs' };

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };
    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(uri, options);
}

export default client;
```

## Create new page
Create a new page in pages/eodMarketIndex.tsx

Start with:
```typescript
import type { GetServerSideProps } from "next";
import { useEffect } from "react";
# Import your mongo library
import client from "../lib/mongodb";
```

Define the data structure:
```typescript
type MarketIndex = {
    date: string;
    symbol: string;
    change: number;
    change_percent: number;
    price: number;
};
```

Define the shape of the props the page component expects:
```typescript
type Props = {
    eodMarketIndexData: MarketIndex[];
};
```

Next.js passes those props to the default-exported page component, and GetServerSideProps<Props> uses the same type to describe what getServerSideProps returns. It’s a compile-time contract—not a React component or runtime object.

The declaration would let TypeScript check that each item has the fields your component renders.

### Create the default function
Start with this and add more logic later to render the mongo collection data into a html table.
```typescript
export default function EodMarketIndexPage({
    eodMarketIndexData
}: Props) {
    useEffect(() => {
        console.log(eodMarketIndexData);
    }, [eodMarketIndexData]);
    return (
        <div>
            <h1>EOD Market Index Data</h1>
            {/* Add more html and logic here for rendering your data */}
        </div>
    );
}
```

### Create getServerSideProps
This is the method that querries the mongodb database for data and returns the data as a props json object. This method is called by nextjs on the server.

```typescript
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    try {
        await client.connect();
        const db = client.db("market");
        const collection = db.collection<MarketIndex>("eod_market_index");
        const eodMarketIndexData = await collection.find().toArray();

        return {
            props: {
                eodMarketIndexData: JSON.parse(JSON.stringify(eodMarketIndexData)),
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                eodMarketIndexData: [],
            },
        };
    } finally {
        await client.close();
    }
};
```

## Understanding the basic flow

1. Next.js calls getServerSideProps on the server.
2. It returns { props: { eodMarketIndexData: ... } }.
3. Next.js passes the props contents to the default-exported EodMarketIndexPage component. The component destructures eodMarketIndexData from that object.
4. React renders the component. 
5. Then, in the browser, useEffect runs and logs the data to the browser’s developer console. useEffect can be used for other effects like color changes, a timer etc.

### Run in dev mode
```npm run dev```

### In the browser
http://localhost:3000/eodMarketIndex

