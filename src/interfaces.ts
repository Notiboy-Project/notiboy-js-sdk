//Regular channel
export interface RegularChannel {
  channelName: string | number;
  appIndex: string | number;
  channelIndex: number;
  verificationStatus: string | number;
}
//Public notification
export interface PublicNotification {
  index: number;
  notification: string;
}
//Personal Notification
export interface PersonalNotification {
  appIndex: string | number;
  notification: string | number;
  timeStamp: string | number;
}
//Counter for personal and public notification
export interface counter {
  personalNotification: number;
  publicNotification: number;
}
//channel app Index
export interface channeIndex {
  channelAppIndex: number;
  channelName: string;
}
