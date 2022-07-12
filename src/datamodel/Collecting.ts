import Chains from "./Chains";

export default interface Collecting {
    chain: Chains,
    address: string,
    startBlockNumber: number,
    fromId: number,
    toId: number,
    currentId: number,
    ended?: boolean,
}