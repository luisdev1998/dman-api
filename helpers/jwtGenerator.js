import jwt from 'jsonwebtoken'

const jwtGenerator = (id) => {
    return jwt.sign({id},process.env.API_JWT_SECRET, {
        expiresIn: "1d"
    });
}

export default jwtGenerator;