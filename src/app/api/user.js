import { getUserByEmail } from '../../lib/db'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query
    try {
      const user = await getUserByEmail(email)
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}