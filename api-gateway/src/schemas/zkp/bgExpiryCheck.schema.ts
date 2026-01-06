import { Type } from "@sinclair/typebox";

export const BGExpiryCheckBody = Type.Object(


    {

        NDays: Type.String(),
        POEndDate: Type.String(),
        bgExpiry: Type.String(),
        bgExpiryHash: Type.String(),

    },

    {

        examples: [

            {

                bgExpiry: "9034893478",
                POEndDate: "1245893094",
                NDays: "2439530850",
                bgExpiryHash: "0x05bcbd60cb89752c0d568c7efec18f2a7d30f8ae73873af8754e1c5cd81a45a6"

            }

        ]

    }

)