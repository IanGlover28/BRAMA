declare module "@resend/node" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send: (options: {
        from: string;
        to: string;
        subject: string;
        html: string;
      }) => Promise<void>;
    };
  }
}
