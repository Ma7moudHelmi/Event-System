const jwt=require("jsonwebtoken");

module.exports=(request,response,next)=>{
    let token, decode;

    try {
        token =  request.get("Authorization").split(" ")[1];
        decode = jwt.verify(token,"mahmoudwa7dbs");

    } catch (error) {
        let errorObj = new Error("Something Went Wrong");
        errorObj.status = 403;
        next(errorObj);
    }
    request.role=decode.role
    if(decode.id != undefined)
    request.id=decode.id
    next();
}