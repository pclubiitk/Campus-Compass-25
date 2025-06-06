import { Pool } from 'pg';
import { NextRequest } from 'next/server';


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'campus_compass',
  password: 'ritikaSQL',
  port: 5432,
});


export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const id = '1'; // hardcoded user id

  try {
    // Fetch user details
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    const user = userResult.rows[0];

    // Fetch contribution
    // const contributionResult = await pool.query(
    //   'SELECT review, rating FROM contributions WHERE user_id = $1 LIMIT 1',
    //   [id]
    // );
    // const contribution = (contributionResult?.rowCount ?? 0) > 0 ? contributionResult.rows[0] : null;
    const contributionResult = await pool.query(
  `SELECT c.review, c.rating, c.spot_id, i.url AS image_url
   FROM contributions c
   LEFT JOIN image i ON c.spot_id = i.spot_id
   WHERE c.user_id = $1
   LIMIT 1`,
  [id]
);

const contribution = (contributionResult?.rowCount ?? 0) > 0
  ? {
      review: contributionResult.rows[0].review,
      rating: contributionResult.rows[0].rating,
      spot_id: contributionResult.rows[0].spot_id,
      image_url: contributionResult.rows[0].image_url,
    }
  : null;
 let contributionImageUrl = null;
    if (contribution) {
      const imageResult = await pool.query(
        'SELECT url FROM image WHERE spot_id = $1 LIMIT 1',
        [contribution.spot_id]
      );
      contributionImageUrl = (imageResult?.rowCount ?? 0) > 0 ? imageResult.rows[0].url : null;
    }

    // Fetch spot
    const spotResult = await pool.query(
  'SELECT spot_id, description, rating FROM spots WHERE user_id = $1 LIMIT 1',
  [id]
);

    const spot = (spotResult?.rowCount ?? 0) > 0 ? spotResult.rows[0] : null;

     // If spot exists, fetch image URL
    let spotImageUrl = null;
    if (spot) {
      const spotImageResult = await pool.query(
        'SELECT url FROM image WHERE spot_id = $1 LIMIT 1',
        [spot.spot_id]
      );
      spotImageUrl = (spotImageResult?.rowCount ?? 0) > 0 ? spotImageResult.rows[0].url : null;
    }


    // Fetch locations
    // const locationsResult = await pool.query(
    //   'SELECT id, location_type, latitude, longitude FROM location WHERE user_id = $1',
    //   [id]
    // );
    // const locations = locationsResult.rows;

    const profile = {
      user: {
        email: user.email,
        profile_image: user.profile_image,
      },
      contribution: contribution
        ? {
            review: contribution.review,
            rating: contribution.rating,
            image_url: contributionImageUrl,
          }
        : null,
      spot: spot
        ? {
            description: spot.description,
            rating: spot.rating,
            image_url: spotImageUrl,
          }
        : null,
      
    };


    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 