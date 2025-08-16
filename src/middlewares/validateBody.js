import createHttpError from "http-errors";

export default function validateBody (schema) {
    return async (req, res, next)=>{
        try {
            const result = await schema.validateAsync(req.body, {abortEarly: false});
            next();
        } catch (error) {
            const errors = error.details.map(detail => detail.message);
            next(new createHttpError.BadRequest(errors));
        }
    
    }
}