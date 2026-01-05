import { Type } from "@sinclair/typebox";

export const AmountWithinRangeBody = Type.Object(

    {

        invoiceTotal: Type.String(),
        poBalance: Type.String(),
        poBalanceHash: Type.String(),

    },
    {

        examples: [

            {

                invoiceTotal: "1000000",
                poBalance: "1000001",
                poBalanceHash: "0x0d24ab574a2457e4f81d35721edbe398284a594ff827a343b14761a13a77d73"

            }

        ]

    }

)