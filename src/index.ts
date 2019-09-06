export type Leg = {
  flag: string;
  name: string;
  amount: number;
  currency: string;
};

export type Posting = {
  transaction: {
    date: Date;
    flag: string;
    payee: string;
    narration: string;
  };
  leg1: Leg;
  leg2?: Leg;
};

export interface IConverter {
  name: string;

  // tslint:disable-next-line:no-any
  convert(csvRow: { [key: string]: any }): Posting;

  account: string;
}

class ChaseChecking implements IConverter {
  public name: string = "Chase Checking";
  public account: string = "Assets:Cash:Chase:Checking";

  // tslint:disable-next-line:no-any
  public convert(csvRow: { [p: string]: any }): Posting {
    const ts = csvRow["Posting Date"];
    return {
      transaction: {
        date: ts ? new Date(ts) : new Date(),
        flag: "*",
        payee: csvRow.Description,
        narration: ""
      },
      leg1: {
        name: this.account,
        amount: csvRow.Amount,
        currency: "USD",
        flag: ""
      }
    };
  }
}

export default [new ChaseChecking()];
