


export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
if (!authHeader)  {
    return res.status(401).send({error: 'No llego ningun token en los headers'});
}
const token = authHeader.split(' ')[1];
try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = payload.id; //modifica el req agregando el user id que viene en el token
    next();
 } // Pasa al proximo middleware  
 catch (err) {
    console.error(err);
    return res.status(401).send({error: 'Unauthorized'});
 }
}