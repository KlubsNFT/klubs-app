import { WebSocketClient } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import Collecting from "../datamodel/Collecting";

export default class HolderCollecting implements View {

    private hookingClient: WebSocketClient | undefined;

    constructor(params: ViewParams) {
        if (params.chain !== undefined && params.address !== undefined) {
            this.load(params.chain, params.address);
        }
    }

    private async load(chain: string, address: string) {
        const result = await fetch(`https://nft-holder-collector.webplusone.com/collecting/${chain}/${address}`);
        const resultStr = await result.text();
        if (resultStr === "") {
            //TODO:
            console.log("아직 데이터가 없음");
        } else {
            const collecting: Collecting = JSON.parse(resultStr);
            if (collecting.ended !== true) {
                this.hookingClient = new WebSocketClient("wss://nft-holder-collector.webplusone.com");
                this.hookingClient.on("connect", () => {
                    this.hookingClient?.send("hook-collecting-process", chain, address);
                    this.hookingClient?.on("collected", (id: number) => {
                        console.log(collecting.fromId, collecting.toId, id);
                    });
                });
            }
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.hookingClient?.delete();
    }
}