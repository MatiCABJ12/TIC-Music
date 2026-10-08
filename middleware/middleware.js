

  const { token } = req.body;

    if (!token) {
        return res.status(401).json({
            error: "Falta un token"
        });
    }

    let verificacion;

    try { // FIJARTE COMO ESTA EN LA PRESENTACION DE MIDDLEWAREEEEEEEEEEEE
        verificacion = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

    } catch (error) {
        return res.status(401).json({
            error: "El token no ha sido verificado correctamente o ha expirado"
        });
    }