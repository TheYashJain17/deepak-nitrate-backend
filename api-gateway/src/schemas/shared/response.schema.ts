import { Type } from "@sinclair/typebox";


export const SuccessResponse = Type.Object(

    {

        message: Type.String(),
        success: Type.Boolean(),
        data: Type.Unknown(),

    },
    {
        examples: [
            {

                message: "success",
                success: true,
                data: {},


            },

        ]

    }

)

export const ErrorResponse = Type.Object(

    {

        message: Type.String(),
        success: Type.Boolean(),
        data: Type.Unknown(),

    },

    {

        examples: [

            {

                message: "failed",
                success: false,
                data: {},

            }

        ]

    }

)