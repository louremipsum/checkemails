export enum Label {
  Important = "Important",
  Marketing = "Marketing",
  Spam = "Spam",
  Promotions = "Promotions",
  Social = "Social",
  General = "General",
}

export type emailDetailsType = {
  index: number;
  from: string;
  snippet: string;
  plainText: string;
  htmlText: string;
  category: Label;
};

type MessagePartBody = {
  attachmentId?: string;
  size: number;
  data?: string;
};

type Header = {
  name: string;
  value: string;
};

type MessagePart = {
  partId: string;
  mimeType: string;
  filename: string;
  headers: Header[];
  body: MessagePartBody;
  parts?: MessagePart[];
};

export type MessageDataType = {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: MessagePart;
  sizeEstimate: number;
  raw: string;
};
