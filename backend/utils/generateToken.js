import jwt from 'jsonwebtoken'
export async function generateTokenAndSetCookie(userId, res) {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' })

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== "development"
    })

}