//Interfaces defined
export interface RegularChannel {
  channelName: string;
  dappAddress: string;
  lsigAddress: string;
}

export interface PublicNotification {
  notification: string;
  timeStamp: any;
}

export interface PersonalNotification {
  channel: string;
  notification: string;
  timeStamp: any;
}
