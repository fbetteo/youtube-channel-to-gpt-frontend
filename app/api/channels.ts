// app/pages/api/channels.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {RowDataPacket} from 'mysql2'
// import connection from '../lib/db';
import mysql from 'mysql2/promise';

interface Channel extends RowDataPacket {
  user_id: number;
    name: string;
    assistant_name: string
  // Add other channel fields as needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Channel[] | { message: string }>
) {

  const connection = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
      });


    try {
      const query = 'SELECT * FROM channels;'
      const [rows] = await connection.query<any>(query,
         (_err, rows) => {
        console.log(rows);
        /**
         * @rows: [ { test: 2 } ]
         */
      });
    //   res.status(200).json(rows));
  } catch (error) {
      console.error('Error fetching channels', error);
      res.status(500).json({ message: 'Error fetching channels' });
  }
}
