export enum Label {
  Important = "Important",
  Marketing = "Marketing",
  Spam = "Spam",
  Promotional = "Promotional",
  Social = "Social",
  General = "General",
  Nothing = "Nothing",
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

export type MessagePart = {
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
