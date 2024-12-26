import express from "express"
import { pool } from './db.js'
const app = express()

app.use(express.json())
pool.connect().then(() => { console.log('Connected to postgres') }).catch(e => console.error(e))

app.post('/createusertable', async (req, res) => {
    try {
        
        await pool.query(`Create table blogger(name varchar(40) , id SERIAL PRIMARY KEY, email varchar(40),password varchar(50))`)
        return res.status(200).json({ message: 'Blogger table created successfully' })

    }
    catch (e) {
        console.error(e)
        return res.status(500).json(e)


    }
})

app.post('/createposttable', async (req, res) => {
    try {
        await pool.query(`Create table post(title varchar(30), description varchar(100) , created_by INTEGER REFERENCES blogger(id) ON DELETE CASCADE);`)
        return res.status(200).json({ message: 'Post table added successfully' })
    }
    catch (e) {
        return res.status(500).json(e)

    }
})

app.post('/registeruser', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const result = await pool.query('select email from blogger where email = $1', [email])
        if (result.rowCount === 0) {
            return res.status(409).json({ message: 'User already exists' })
        }
        await pool.query(`insert into blogger(name,email,password) values($1,$2,$3)`, [name, email, password])
        return res.status(200).json({ message: 'added user successfully' })
    }
    catch (e) {
        return res.status(500).json(e)

    }
})

app.get('/showuser', async (req, res) => {
    try {
        const result = await pool.query('select * from blogger');
        return res.status(200).json(result.rows)
    }
    catch (e) {

        return res.status(500).json(e)
    }
})

app.post('/addpost', async (req, res) => {
    try {
        const { title, description, email } = req.body
        const result = await pool.query(`select id from blogger where email=$1`, [email])
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not exists" })
        }
        await pool.query(`insert into post(title,description,created_by) values($1,$2,$3)`, [title, description, result.rows[0].id])
        return res.status(200).json({ message: "Post added successfully" })

    }
    catch (e) {
        return res.status(500).json(e)
    }

})

app.get('/showposts', async (req, res) => {
    try {
        const {email}=req.body
        const result1 = await pool.query('select id from blogger where email=$1', [email])
        const id=result1.rows[0].id
        const result2=await pool.query('select * from post where created_by = $1', [id])
        const posts=result2.rows
        return res.status(200).json(posts)
    }
    catch (e) {
        return res.status(500).json(e)
    }
})



app.listen(4000, () => {
    console.log(`App running on port 4000`);

})
