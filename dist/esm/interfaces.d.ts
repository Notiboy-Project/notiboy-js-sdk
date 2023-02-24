export interface RegularChannel {
    channelName: string | number;
    appIndex: string | number;
    channelIndex: number;
    verificationStatus: string | number;
}
export interface PublicNotification {
    index: number;
    notification: string;
}
export interface PersonalNotification {
    appIndex: string | number;
    notification: string | number;
    timeStamp: string | number;
}
export interface counter {
    personalNotification: number;
    publicNotification: number;
}
export interface channeIndex {
    channelAppIndex: number;
    channelName: string;
}
