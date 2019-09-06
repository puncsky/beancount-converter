import test from "ava";
import converters, { Leg } from "..";
import csv from "csvtojson";

function legToString(leg?: Leg): string {
  if (!leg) {
    return "";
  }
  return `${leg.flag ? `${leg.flag} ` : ""}${leg.name}  ${leg.amount} ${
    leg.currency
  }`;
}

test("converter test", async t => {
  t.deepEqual(converters[0].name, "Chase Checking");
  t.deepEqual(converters[0].account, "Assets:Cash:Chase:Checking");

  const csvRows = await csv()
    .fromString(`Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #
DEBIT,09/30/2019,"Pacific Gas & El PAYMENT",-46.21,ACH_DEBIT,4504.15,,
CREDIT,09/30/2019,"Rent Income",3400.65,ACH_CREDIT,4550.36,,
DEBIT,09/28/2019,"CHASE CREDIT CRD AUTOPAY",-23.20,ACH_DEBIT,1149.71,,
`);
  const result = csvRows
    .map(row => {
      const entry = converters[0].convert(row);
      return `${entry.transaction.date.toISOString().slice(0, 10)} ${
        entry.transaction.flag ? "*" : "!"
      } "${entry.transaction.payee}" "${entry.transaction.narration}"
  ${legToString(entry.leg1)}
  ${legToString(entry.leg2)}
`;
    })
    .join("\n");
  t.deepEqual(
    result,
    `2019-09-30 * "Pacific Gas & El PAYMENT" ""
  Assets:Cash:Chase:Checking  -46.21 USD
  

2019-09-30 * "Rent Income" ""
  Assets:Cash:Chase:Checking  3400.65 USD
  

2019-09-28 * "CHASE CREDIT CRD AUTOPAY" ""
  Assets:Cash:Chase:Checking  -23.20 USD
  
`
  );
});
