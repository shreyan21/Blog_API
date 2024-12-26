import pkg from "pg"
import dotenv from 'dotenv'

dotenv.config()
const {Pool}=pkg


const pool=new Pool({
    user:'postgres',
    password:`${process.env.DB_PASSWORD}`,
    host:'localhost',
    port:'5432',
    database:'blog'

})

export {pool}

