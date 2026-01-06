import { Type } from "@sinclair/typebox";

export const ClauseInclusionBody = Type.Object(

    {

        agreementId: Type.String(),
        clauseSetHash: Type.String(),
        commitment: Type.String(),

    },

    {

        examples: [

            {

                agreementId: "0x0000000000000000000000000000000000000000000000003436363136343230",
                clauseSetHash: "0x02fa8010506962fc6fd6c3741f0c8aff93954aacb49a54eedeea63ece6f5175b",
                commitment: "0x01e406c16cbd4b400d85012453fae99a77bd4bd7c694696b8824ee76d5870755"
            }

        ]

    }

)

