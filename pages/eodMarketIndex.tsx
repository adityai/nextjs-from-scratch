import type { GetServerSideProps } from "next";
import { useEffect } from "react";
import client from "../lib/mongodb";

type MarketIndex = {
    date: string;
    symbol: string;
    change: number;
    change_percent: number;
    price: number;
};

type Props = {
    eodMarketIndexData: MarketIndex[];
};

export default function EodMarketIndexPage({
    eodMarketIndexData
}: Props) {
    useEffect(() => {
        console.log(eodMarketIndexData);
    }, [eodMarketIndexData]);
    return (
        <div>
            <h1>EOD Market Index Data</h1>
            <table style={{ width: "70%", borderCollapse: "collapse", textAlign: "center", tableLayout: "fixed" }}>
                <thead>
                    <tr><th>Date</th><th>Index</th><th>Change</th><th>Change %</th><th>Price</th></tr>
                </thead>
                <tbody>
                    {
                        eodMarketIndexData.length > 0 ? (
                            eodMarketIndexData.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>{item.symbol}</td>
                                    <td>{item.change}</td>
                                    <td>{item.change_percent}</td>
                                    <td>{item.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No data found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    try {
        const db = await client.db("market");
        const collection = db.collection("eod_market_index");
        const eodMarketIndexData = await collection.find({}).toArray();
        // console.log(eodMarketIndexData);
        return {
            props: {
                eodMarketIndexData: JSON.parse(JSON.stringify(eodMarketIndexData)),
            },
        };
    } catch (error) {
        console.log(error);
        console.error(error);
        return {
            props: { eodMarketIndexData: [] },
        };
    }
};